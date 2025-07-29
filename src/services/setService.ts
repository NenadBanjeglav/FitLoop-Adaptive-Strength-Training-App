import { ExerciseSet } from "@/types/models";
import { randomUUID } from "expo-crypto";

export const createSet = (exerciseId: string) => {
  const newSet: ExerciseSet = {
    id: randomUUID(),
    exerciseId,
  };

  return newSet;
};

export const updateSet = (
  set: ExerciseSet,
  updatedFields: Pick<ExerciseSet, "reps" | "weight">
) => {
  const updatedSet = { ...set };

  if (updatedFields.reps !== undefined) {
    updatedSet.reps = updatedFields.reps;
  }

  if (updatedFields.weight !== undefined) {
    updatedSet.weight = updatedFields.weight;
  }

  return updatedSet;
};

const isSetComplete = (set: ExerciseSet) => {
  return typeof set.reps === "number" && set.reps > 0;
};

export const cleanSets = (sets: ExerciseSet[]) => {
  return sets.filter(isSetComplete);
};
