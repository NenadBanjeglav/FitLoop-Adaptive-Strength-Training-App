import { Exercise, ExerciseSet, WorkoutWithExercises } from "@/types/models";
import { create } from "zustand";
import * as Crypto from "expo-crypto";
import { createExerciseWithSet } from "@/services/exerciseService";
import { createSet, updateSet } from "@/services/setService";
import { cleanWorkout } from "@/services/workoutService";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type State = {
  currentWorkout: WorkoutWithExercises | null;
  workouts: WorkoutWithExercises[];
};

type Actions = {
  startWorkout: () => void;
  finishWorkout: () => void;
  addExercise: (catalogExercise: Exercise) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (
    setId: string,
    updatedFields: Pick<ExerciseSet, "reps" | "weight">
  ) => void;
  deleteSet: (setId: string) => void;
};

export const useWorkouts = create<State & Actions>()((set, get) => ({
  //state
  currentWorkout: null,
  workouts: [],

  //actions
  startWorkout: () => {
    const newWorkout: WorkoutWithExercises = {
      id: Crypto.randomUUID(),
      createdAt: new Date(),
      finishedAt: null,
      exercises: [],
    };

    set({ currentWorkout: newWorkout });
  },

  finishWorkout: () => {
    const { currentWorkout } = get();

    if (!currentWorkout) {
      return;
    }

    const finishedWorkout = cleanWorkout({
      ...currentWorkout,
      finishedAt: new Date(),
    });

    set((state) => ({
      currentWorkout: null,
      workouts: [finishedWorkout, ...state.workouts],
    }));
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
}));
