export interface User {
  id: string;
  username: string;
}

export interface Exercise {
  id: string;
  description: string;
  duration: number;
  date: string;
}

export interface UserExerciseLog extends User {
  logs: Exercise[];
  count: number;
}

export interface CreatedExerciseResponse {
  userId: string;
  exerciseId: string;
  duration: number;
  description: string;
  date: string;
}

export interface ErrorResponse {
  error: string;
}
