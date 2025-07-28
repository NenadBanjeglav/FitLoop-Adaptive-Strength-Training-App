import { Exercise, WorkoutWithExercises } from "@/types/models";
import { create } from "zustand";
import * as Crypto from "expo-crypto";
import { createExerciseWithSet } from "@/services/exerciseService";

type State = {
  currentWorkout: WorkoutWithExercises | null;
  workouts: WorkoutWithExercises[];
};

type Actions = {
  startWorkout: () => void;
  finishWorkout: () => void;
  addExercise: (catalogExercise: Exercise) => void;
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

    const finishedWorkout = {
      ...currentWorkout,
      finishedAt: new Date(),
    };

    set((state) => ({
      currentWorkout: null,
      workouts: [finishedWorkout, ...state.workouts],
    }));
  },

  addExercise: (catalogExercise: Exercise) => {
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
}));
