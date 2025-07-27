import dayjs from "dayjs";
import { ExerciseSet } from "./types/models";

export const getBestSet = (sets: ExerciseSet[]) => {
  return sets.reduce(
    (acc: ExerciseSet | null, cur) =>
      (cur?.oneRM || 0) > (acc?.oneRM || 0) ? cur : acc,
    null
  );
};
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
