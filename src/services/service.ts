import { WorkoutWithExercises } from "@/types/models";

import { ExerciseSet } from "@/types/models";
import { randomUUID } from "expo-crypto";
import { Exercise, ExerciseWithSets } from "@/types/models";

import { getDB } from "@/db";

export const cleanWorkout = (workout: WorkoutWithExercises) => {
  const cleanedExercises = workout.exercises
    .map(cleanExercise)
    .filter((e) => e !== null);

  return {
    ...workout,
    exercises: cleanedExercises,
  };
};

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

type PaginatedExercises = {
  data: Exercise[];
  nextCursor: number | null;
};

export const getPaginatedCatalogExercises = async (
  cursor = 0,
  pageSize = 20,
  search = "",
  targets: string[] = [],
  equipments: string[] = []
): Promise<PaginatedExercises> => {
  const db = await getDB();

  // Base query
  let query = `SELECT * FROM catalog_exercises`;
  const filters: string[] = [];
  const params: any[] = [];

  // Search
  if (search) {
    filters.push("LOWER(name) LIKE ?");
    params.push(`%${search.toLowerCase()}%`);
  }

  // Target muscles
  if (targets.length > 0) {
    filters.push(
      `(${targets.map(() => "target_muscles LIKE ?").join(" OR ")})`
    );
    params.push(...targets.map((m) => `%${m}%`));
  }

  // Equipments
  if (equipments.length > 0) {
    filters.push(`(${equipments.map(() => "equipments LIKE ?").join(" OR ")})`);
    params.push(...equipments.map((e) => `%${e}%`));
  }

  if (filters.length > 0) {
    query += ` WHERE ${filters.join(" AND ")}`;
  }

  query += ` ORDER BY name LIMIT ? OFFSET ?`;
  params.push(pageSize, cursor);

  const rows = await db.getAllAsync<any>(query, ...params);

  const data = rows.map(
    (row): Exercise => ({
      exerciseId: row.exercise_id,
      name: row.name,
      gifUrl: row.gif_url,
      targetMuscles: row.target_muscles.split(",").filter(Boolean),
      secondaryMuscles: row.secondary_muscles.split(",").filter(Boolean),
      bodyParts: row.body_parts.split(",").filter(Boolean),
      equipments: row.equipments.split(",").filter(Boolean),
      instructions: row.instructions.split("||").filter(Boolean),
    })
  );

  const nextCursor = rows.length < pageSize ? null : cursor + pageSize;

  return { data, nextCursor };
};
