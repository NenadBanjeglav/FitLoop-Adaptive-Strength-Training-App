export type Workout = {
  id: string;
  createdAt: Date;
  finishedAt: Date | null;
};

export type ExerciseSet = {
  id: string;
  exerciseId: string;
  reps?: number;
  weight?: number;
  oneRM?: number;
};

export type LoggedExercise = {
  id: string;
  workoutId: string;
  catalogExerciseId: string;
  name: string; // snapshot
  gifUrl: string; // snapshot
};

export type Exercise = {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
};

// Additional types for nested structures
export type WorkoutWithExercises = Workout & {
  exercises: ExerciseWithSets[];
};

export type ExerciseWithSets = LoggedExercise & {
  sets: ExerciseSet[];
};
