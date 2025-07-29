import dayjs from "dayjs";
import { ExerciseSet, ExerciseWithSets } from "./types/models";

export const calculateDuration = (start: Date, end: Date | null) => {
  if (!end) return "0:00:00";

  const durationInSeconds = dayjs(end).diff(dayjs(start), "seconds");
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// utils/paginateExercises.ts
import exercises from "@/data/exercises";

const PAGE_SIZE = 20;

export function getPaginatedExercises(cursor: number = 0, search: string = "") {
  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(cursor, cursor + PAGE_SIZE);
  const nextCursor =
    cursor + PAGE_SIZE < filtered.length ? cursor + PAGE_SIZE : null;

  return {
    data: paginated,
    nextCursor,
  };
}

export function capitalizeWords(text: string) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const getBestSetByOneRM = (sets: ExerciseSet[]): ExerciseSet | null => {
  return sets.reduce<ExerciseSet | null>((best, current) => {
    if (current.reps == null || current.weight == null) return best;

    const currentOneRM = current.weight * (36 / (37 - current.reps));
    const bestOneRM =
      best && best.weight != null && best.reps != null
        ? best.weight * (36 / (37 - best.reps))
        : 0;

    return currentOneRM > bestOneRM ? current : best;
  }, null);
};

export const getBestSetFromWorkout = (
  exercise: ExerciseWithSets
): { set: ExerciseSet; oneRM: number } | null => {
  if (!exercise.sets?.length) return null;

  return exercise.sets.reduce<{
    set: ExerciseSet;
    oneRM: number;
  } | null>((best, current) => {
    if (current.weight == null || current.reps == null) return best;

    const currentOneRM = current.weight * (36 / (37 - current.reps));
    if (!best || currentOneRM > best.oneRM) {
      return { set: current, oneRM: currentOneRM };
    }
    return best;
  }, null);
};
