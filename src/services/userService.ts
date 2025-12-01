import { getUsersCollection, ObjectId } from "../db";
import { User } from "../types";

export interface DbUser {
  _id: ObjectId;
  username: string;
}

export const createUser = async (username: string): Promise<User> => {
  const usersCol = getUsersCollection();
  const result = await usersCol.insertOne({ username });

  return {
    id: result.insertedId.toString(),
    username,
  };
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersCol = getUsersCollection();
  const docs = await usersCol.find().toArray();

  return docs.map((doc: any) => ({
    id: doc._id.toString(),
    username: doc.username,
  }));
};

export const getUserById = async (id: string): Promise<DbUser | null> => {
  const usersCol = getUsersCollection();
  const objectId = new ObjectId(id);
  const user = await usersCol.findOne({ _id: objectId });
  return user as DbUser | null;
};
