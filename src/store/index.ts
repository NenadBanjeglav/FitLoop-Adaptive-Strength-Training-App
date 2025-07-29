import { Exercise, ExerciseSet, WorkoutWithExercises } from "@/types/models";
import { create } from "zustand";
import * as Crypto from "expo-crypto";
import { createExerciseWithSet } from "@/services/exerciseService";
import { createSet } from "@/services/setService";
import { cleanWorkout } from "@/services/workoutService";

import {
  deleteWorkoutFromDB,
  getAllWorkouts,
  getCurrentWorkout,
  saveWorkout,
  updateWorkout,
} from "@/db";

type State = {
  currentWorkout: WorkoutWithExercises | null;
  workouts: WorkoutWithExercises[];
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
};

export const useWorkouts = create<State & Actions>()((set, get) => ({
  //state
  currentWorkout: null,
  workouts: [],

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

    if (!currentWorkout) {
      return;
    }

    const finishedAt = new Date();
    const finishedWorkout = cleanWorkout({
      ...currentWorkout,
      finishedAt,
    });

    if (finishedWorkout.exercises.length === 0) {
      console.warn("Workout not saved: no valid exercises/sets.");
      set({ currentWorkout: null });
      return;
    }

    // Update workout in DB
    await updateWorkout(finishedWorkout.id, finishedAt);

    set((state) => ({
      currentWorkout: null,
      workouts: [finishedWorkout, ...state.workouts],
    }));
  },
  discardCurrentWorkout: () => {
    set({ currentWorkout: null });
  },

  addExercise: (catalogExercise) => {
    const { currentWorkout } = get();

    if (!currentWorkout) return;

    const newExercise = createExerciseWithSet(
      currentWorkout.id,
      catalogExercise
    );

    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout!,
        exercises: [...(state.currentWorkout?.exercises || []), newExercise],
      },
    }));
  },

  addSet: (exerciseId) => {
    const newSet = createSet(exerciseId);

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

    if (workout) {
      set({ currentWorkout: { ...workout, exercises: [] } });
    }
  },
  loadWorkouts: async () => {
    const workouts = await getAllWorkouts();

    // Currently, no exercises are loaded — you'll want to hydrate them later
    const withEmptyExercises = workouts.map((w) => ({
      ...w,
      exercises: [],
    }));

    set({ workouts: withEmptyExercises });
  },
  deleteWorkout: async (id) => {
    await deleteWorkoutFromDB(id); // deletes from SQLite

    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
  },
}));
