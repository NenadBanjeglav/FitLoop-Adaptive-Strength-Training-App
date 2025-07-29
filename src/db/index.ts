import { Exercise, Workout } from "@/types/models";
import rawExercises from "@/data/exercises";
import * as SQLite from "expo-sqlite";
import { DbExerciseSet, DbLoggedExercise } from "@/types/db";

let db: SQLite.SQLiteDatabase | null = null;

export const dbName = "fitLoop.db";

export const createWorkoutsTableQuery = `
CREATE TABLE IF NOT EXISTS workouts (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  finished_at TEXT
);`;

export const createLoggedExercisesTableQuery = `
  CREATE TABLE IF NOT EXISTS logged_exercises (
  id TEXT PRIMARY KEY,
  workout_id TEXT NOT NULL,
  catalog_exercise_id TEXT NOT NULL,
  name TEXT NOT NULL,
  gif_url TEXT,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);`;

export const createSetsTableQuery = `
CREATE TABLE IF NOT EXISTS sets (
  id TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL,
  reps INTEGER,
  weight REAL,
  FOREIGN KEY (exercise_id) REFERENCES logged_exercises(id) ON DELETE CASCADE
);`;

export const createCatalogExercisesTableQuery = `
CREATE TABLE IF NOT EXISTS catalog_exercises (
  exercise_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gif_url TEXT,
  target_muscles TEXT,
  secondary_muscles TEXT,
  body_parts TEXT,
  equipments TEXT,
  instructions TEXT
);`;

export const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(dbName);

  //set up tables

  await db.execAsync("PRAGMA foreign_keys = ON");

  await db.execAsync(createCatalogExercisesTableQuery);
  await db.execAsync(createLoggedExercisesTableQuery);
  await db.execAsync(createWorkoutsTableQuery);
  await db.execAsync(createSetsTableQuery);

  return db;
};

export const seedCatalogExercises = async () => {
  const db = await getDB();

  const existing = (await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM catalog_exercises"
  )) as { count: number };

  if (existing?.count > 0) {
    console.log("Catalog already seeded");
    return;
  }

  for (const ex of rawExercises) {
    await db.runAsync(
      `INSERT INTO catalog_exercises (
        exercise_id, name, gif_url,
        target_muscles, secondary_muscles,
        body_parts, equipments, instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ex.exerciseId,
        ex.name,
        ex.gifUrl,
        ex.targetMuscles.join(","),
        ex.secondaryMuscles.join(","),
        ex.bodyParts.join(","),
        ex.equipments.join(","),
        ex.instructions.join("||"),
      ]
    );
  }

  console.log("Catalog seeded");
};

export const saveWorkout = async (workout: Workout) => {
  try {
    const db = await getDB();

    await db.runAsync(
      "INSERT OR REPLACE INTO workouts (id, created_at, finished_at) VALUES (?, ?, ?);",
      workout.id,
      workout.createdAt.toISOString(),
      workout.finishedAt?.toISOString() || null
    );
  } catch (error) {
    console.error(error);
  }
};

export const updateWorkout = async (
  workoutId: string,
  finishedAt: Date
): Promise<void> => {
  try {
    const db = await getDB();

    await db.runAsync(
      "UPDATE workouts SET finished_at = ? WHERE id = ?;",
      finishedAt.toISOString(),
      workoutId
    );
  } catch (error) {
    console.error("Failed to update workout:", error);
  }
};

export const getCurrentWorkout = async (): Promise<Workout | null> => {
  try {
    const db = await getDB();

    const result = await db.getFirstAsync<Workout>(
      "SELECT id, created_at as createdAt, finished_at as finishedAt FROM workouts WHERE finished_at IS NULL ORDER BY created_at DESC LIMIT 1"
    );

    if (!result) return null;

    return {
      ...result,
      createdAt: new Date(result.createdAt),
      finishedAt: result.finishedAt ? new Date(result.finishedAt) : null,
    };
  } catch (error) {
    console.error("Failed to get current workout:", error);
    return null;
  }
};

export const getAllWorkouts = async (): Promise<Workout[]> => {
  try {
    const db = await getDB();

    const results = await db.getAllAsync<Workout>(
      "SELECT id, created_at as createdAt, finished_at as finishedAt FROM workouts WHERE finished_at IS NOT NULL ORDER BY finished_at DESC"
    );

    return results.map((w) => ({
      ...w,
      createdAt: new Date(w.createdAt),
      finishedAt: w.finishedAt ? new Date(w.finishedAt) : null,
    }));
  } catch (error) {
    console.error("Failed to get workouts:", error);
    return [];
  }
};

export const deleteWorkoutFromDB = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.runAsync("DELETE FROM workouts WHERE id = ?", id);
  } catch (error) {
    console.error("Failed to delete workout:", error);
  }
};

export const getAllExercisesFromDB = async (): Promise<Exercise[]> => {
  const db = await getDB();

  const rows = await db.getAllAsync<{
    exercise_id: string;
    name: string;
    gif_url: string;
    target_muscles: string;
    secondary_muscles: string;
    body_parts: string;
    equipments: string;
    instructions: string;
  }>("SELECT * FROM catalog_exercises");

  return rows.map((row) => ({
    exerciseId: row.exercise_id,
    name: row.name,
    gifUrl: row.gif_url,
    targetMuscles: row.target_muscles.split(","),
    secondaryMuscles: row.secondary_muscles.split(","),
    bodyParts: row.body_parts.split(","),
    equipments: row.equipments.split(","),
    instructions: row.instructions.split("||"),
  }));
};

export const insertSetToDB = async (set: DbExerciseSet): Promise<void> => {
  const db = await getDB();

  await db.runAsync(
    `INSERT INTO sets (id, exercise_id, reps, weight) VALUES (?, ?, ?, ?)`,
    set.id,
    set.exerciseId,
    set.reps ?? null,
    set.weight ?? null
  );
};

export const updateSetInDB = async (
  id: string,
  updates: Partial<{ reps: number; weight: number }>
): Promise<void> => {
  const db = await getDB();

  const fields = [];
  const values = [];

  if (updates.reps !== undefined) {
    fields.push("reps = ?");
    values.push(updates.reps);
  }
  if (updates.weight !== undefined) {
    fields.push("weight = ?");
    values.push(updates.weight);
  }

  if (fields.length === 0) return;

  values.push(id);

  await db.runAsync(
    `UPDATE sets SET ${fields.join(", ")} WHERE id = ?`,
    ...values
  );
};

export const deleteSetFromDB = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.runAsync(`DELETE FROM sets WHERE id = ?`, id);
};

export const getLoggedExercisesForWorkout = async (
  workoutId: string
): Promise<DbLoggedExercise[]> => {
  const db = await getDB();

  const results = await db.getAllAsync<DbLoggedExercise>(
    `SELECT id, workout_id as workoutId, catalog_exercise_id as catalogExerciseId, name, gif_url as gifUrl
     FROM logged_exercises
     WHERE workout_id = ?`,
    workoutId
  );

  return results;
};

export const getSetsForExercise = async (
  exerciseId: string
): Promise<DbExerciseSet[]> => {
  const db = await getDB();

  const results = await db.getAllAsync<DbExerciseSet>(
    `SELECT id, exercise_id as exerciseId, reps, weight
     FROM sets
     WHERE exercise_id = ?`,
    exerciseId
  );

  return results;
};

export const insertLoggedExercise = async (
  exercise: DbLoggedExercise
): Promise<void> => {
  const db = await getDB();

  await db.runAsync(
    `INSERT INTO logged_exercises (id, workout_id, catalog_exercise_id, name, gif_url)
     VALUES (?, ?, ?, ?, ?)`,
    exercise.id,
    exercise.workoutId,
    exercise.catalogExerciseId,
    exercise.name,
    exercise.gifUrl
  );
};
