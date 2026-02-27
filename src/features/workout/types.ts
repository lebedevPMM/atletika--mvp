export type ExerciseStatus = 'pending' | 'active' | 'completed' | 'skipped';

export interface WorkoutPlan {
  id: string;
  bookingId: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps?: number;
  durationMinutes?: number;
  status: ExerciseStatus;
  completedSets: number;
  weight?: number;
}

export interface WorkoutLog {
  bookingId: string;
  durationMinutes: number;
  exercisesCompleted: number;
  totalVolume: number; // kg
}
