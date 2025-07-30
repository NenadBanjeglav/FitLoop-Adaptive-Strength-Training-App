import { Exercise, ExerciseSet, WorkoutWithExercises } from "@/types/models";
import { create } from "zustand";
import * as Crypto from "expo-crypto";

import {
  deleteWorkoutFromDB,
  getAllWorkouts,
  getCurrentWorkout,
  saveWorkout,
  updateWorkout,
  insertSetToDB,
  updateSetInDB,
  deleteSetFromDB,
  getLoggedExercisesForWorkout,
  getSetsForExercise,
  insertLoggedExercise,
} from "@/db";
import {
  cleanIncompleteExercisesFromDB,
  cleanWorkout,
  createExerciseWithSet,
  createSet,
} from "@/services/service";

type State = {
  currentWorkout: WorkoutWithExercises | null;
  workouts: WorkoutWithExercises[];
  lastAddedExerciseId: string | null;
};

type Actions = {
  startWorkout: () => void;
  finishWorkout: () => void;
  discardCurrentWorkout: () => void;
  loadWorkouts: () => Promise<void>;
  hydrateCurrentWorkout: () => Promise<void>;
  addExercise: (catalogExercise: Exercise) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (
    setId: string,
    updatedFields: Pick<ExerciseSet, "reps" | "weight">
  ) => void;
  deleteSet: (setId: string) => void;
  deleteWorkout: (id: string) => Promise<void>;
  setLastAddedExerciseId: (id: string) => void;
};

export const useWorkouts = create<State & Actions>()((set, get) => ({
  //state
  currentWorkout: null,
  workouts: [],
  lastAddedExerciseId: null,

  //actions
  startWorkout: async () => {
    const newWorkout: WorkoutWithExercises = {
      id: Crypto.randomUUID(),
      createdAt: new Date(),
      finishedAt: null,
      exercises: [],
    };

    await saveWorkout(newWorkout);

    set({ currentWorkout: newWorkout });
  },

  finishWorkout: async () => {
    const { currentWorkout } = get();

    if (!currentWorkout) return;

    // 🔹 Clean DB: remove invalid sets + empty exercises
    await cleanIncompleteExercisesFromDB(currentWorkout.id);

    const finishedAt = new Date();

    // 🔹 Pull fresh, cleaned data from memory
    const finishedWorkout = cleanWorkout({
      ...currentWorkout,
      finishedAt,
    });

    if (finishedWorkout.exercises.length === 0) {
      console.warn("Workout not saved: no valid exercises/sets.");

      // ⛔️ Delete empty workout from DB (MISSING LINE FIXED)
      await deleteWorkoutFromDB(currentWorkout.id);

      set({ currentWorkout: null });
      return;
    }

    // 🔹 Mark workout as finished in DB
    await updateWorkout(finishedWorkout.id, finishedAt);

    // 🔹 Save to in-memory store
    set((state) => ({
      currentWorkout: null,
      workouts: [finishedWorkout, ...state.workouts],
    }));
  },
  discardCurrentWorkout: () => {
    set({ currentWorkout: null });
  },

  addExercise: async (catalogExercise) => {
    const { currentWorkout } = get();
    if (!currentWorkout) return;

    const newExercise = createExerciseWithSet(
      currentWorkout.id,
      catalogExercise
    );
    set({ lastAddedExerciseId: newExercise.id });

    // 🔹 Save logged_exercise to SQLite
    await insertLoggedExercise({
      id: newExercise.id,
      workoutId: currentWorkout.id,
      catalogExerciseId: catalogExercise.exerciseId,
      name: catalogExercise.name,
      gifUrl: catalogExercise.gifUrl,
    });

    // 🔹 Save first set to SQLite
    if (newExercise.sets.length > 0) {
      await insertSetToDB(newExercise.sets[0]);
    }

    // 🔹 Update state
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout!,
        exercises: [...(state.currentWorkout?.exercises || []), newExercise],
      },
    }));
  },

  addSet: (exerciseId) => {
    const newSet = createSet(exerciseId);

    insertSetToDB(newSet); // ✅ Save to DB

    set((state) => {
      const workout = state.currentWorkout;
      if (!workout) return {};

      const updatedExercises = workout.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: [...exercise.sets, newSet],
          };
        }
        return exercise;
      });

      return {
        currentWorkout: {
          ...workout,
          exercises: updatedExercises,
        },
      };
    });
  },

  updateSet: (setId, updatedFields) => {
    updateSetInDB(setId, updatedFields); // ✅ Persist

    set((state) => {
      const workout = state.currentWorkout;
      if (!workout) return {};

      const updatedExercises = workout.exercises.map((exercise) => {
        const updatedSets = exercise.sets.map((set) => {
          if (set.id === setId) {
            return {
              ...set,
              ...updatedFields,
            };
          }
          return set;
        });

        return {
          ...exercise,
          sets: updatedSets,
        };
      });

      return {
        currentWorkout: {
          ...workout,
          exercises: updatedExercises,
        },
      };
    });
  },
  deleteSet: (setId) => {
    deleteSetFromDB(setId); // ✅ Remove from DB

    set((state) => {
      const workout = state.currentWorkout;
      if (!workout) return {};

      const updatedExercises = workout.exercises
        .map((exercise) => ({
          ...exercise,
          sets: exercise.sets.filter((set) => set.id !== setId),
        }))
        .filter((exercise) => exercise.sets.length > 0);

      return {
        currentWorkout: {
          ...workout,
          exercises: updatedExercises,
        },
      };
    });
  },
  hydrateCurrentWorkout: async () => {
    const workout = await getCurrentWorkout();
    if (!workout) return;

    const loggedExercises = await getLoggedExercisesForWorkout(workout.id);

    const exercisesWithSets = await Promise.all(
      loggedExercises.map(async (ex) => ({
        ...ex,
        sets: await getSetsForExercise(ex.id),
      }))
    );

    set({
      currentWorkout: {
        ...workout,
        exercises: exercisesWithSets,
      },
    });
  },
  loadWorkouts: async () => {
    const workouts = await getAllWorkouts();

    const workoutsWithExercises: WorkoutWithExercises[] = await Promise.all(
      workouts.map(async (workout) => {
        const loggedExercises = await getLoggedExercisesForWorkout(workout.id);

        const exercisesWithSets = await Promise.all(
          loggedExercises.map(async (ex) => ({
            ...ex,
            sets: await getSetsForExercise(ex.id),
          }))
        );

        return {
          ...workout,
          exercises: exercisesWithSets,
        };
      })
    );

    set({ workouts: workoutsWithExercises });
  },
  deleteWorkout: async (id) => {
    await deleteWorkoutFromDB(id); // deletes from SQLite

    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
  },
  setLastAddedExerciseId: (id) => set({ lastAddedExerciseId: id }),
}));
