import { ExerciseSet } from "./types/models";

export const getBestSet = (sets: ExerciseSet[]) => {
  return sets.reduce(
    (acc: ExerciseSet | null, cur) =>
      (cur?.oneRM || 0) > (acc?.oneRM || 0) ? cur : acc,
    null
  );
};
