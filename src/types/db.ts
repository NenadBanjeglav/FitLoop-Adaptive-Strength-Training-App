export type DbWorkout = {
  id: string;
  createdAt: Date;
  finishedAt: Date | null;
};

export type DbExerciseSet = {
  id: string;
  exerciseId: string;
  reps?: number;
  weight?: number;
};

export type DbLoggedExercise = {
  id: string;
  workoutId: string;
  catalogExerciseId: string;
  name: string; // snapshot
  gifUrl: string; // snapshot
};

export type DbExercise = {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
};
