import { getExercisesCollection, ObjectId } from "../db";
import { Exercise } from "../types";

export interface CreateExerciseInput {
  userId: ObjectId;
  description: string;
  duration: number;
  date: string;
}

export const createExercise = async (
  input: CreateExerciseInput
): Promise<{ exerciseId: string }> => {
  const exercisesCol = getExercisesCollection();

  const exerciseDoc = {
    userId: input.userId,
    description: input.description,
    duration: input.duration,
    date: input.date,
  };

  const result = await exercisesCol.insertOne(exerciseDoc);

  return { exerciseId: result.insertedId.toString() };
};

export interface LogsQuery {
  userId: ObjectId;
  from?: string;
  to?: string;
  limit?: number;
}

export const getUserLogs = async (
  query: LogsQuery
): Promise<{ logs: Exercise[]; count: number }> => {
  const { userId, from, to, limit } = query;
  const exercisesCol = getExercisesCollection();

  const filter: any = { userId };

  if (from) {
    filter.date = { ...(filter.date || {}), $gte: from };
  }
  if (to) {
    filter.date = { ...(filter.date || {}), $lte: to };
  }

  const totalCount = await exercisesCol.countDocuments(filter);

  let cursor = exercisesCol.find(filter).sort({ date: 1, _id: 1 });

  if (limit !== undefined) {
    cursor = cursor.limit(limit);
  }

  const docs = await cursor.toArray();

  const logs: Exercise[] = docs.map((doc: any) => ({
    id: doc._id.toString(),
    description: doc.description,
    duration: doc.duration,
    date: doc.date,
  }));

  return { logs, count: totalCount };
};
