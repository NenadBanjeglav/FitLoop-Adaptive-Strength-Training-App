import { Exercise, ExerciseSet, ExerciseWithSets } from "@/types/models";
import { randomUUID } from "expo-crypto";
import { cleanSets } from "./setService";

export const createExerciseWithSet = (
  workoutId: string,
  catalogExercise: Exercise
): ExerciseWithSets => {
  const id = randomUUID();

  const set: ExerciseSet = {
    id: randomUUID(),
    exerciseId: id, // Links to this logged exercise
  };

  const loggedExercise: ExerciseWithSets = {
    id,
    workoutId,
    catalogExerciseId: catalogExercise.exerciseId,
    name: catalogExercise.name,
    gifUrl: catalogExercise.gifUrl,
    sets: [set],
  };

  return loggedExercise;
};

export const cleanExercise = (exercise: ExerciseWithSets) => {
  const cleanedSets = cleanSets(exercise.sets);

  if (cleanedSets.length === 0) return null;

  return {
    ...exercise,
    sets: cleanedSets,
  };
};
