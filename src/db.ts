import dotenv from "dotenv";
dotenv.config();

import { MongoClient, Db, Collection, ObjectId } from "mongodb";

const connectionString = process.env.DB_CONNECTION_LINK;
const dbName = process.env.MAIN_DB_NAME;

if (!connectionString) {
  throw new Error("DB_CONNECTION_LINK is not set in .env");
}

if (!dbName) {
  throw new Error("MAIN_DB_NAME is not set in .env");
}

const client = new MongoClient(connectionString);

let db: Db;

export const connectToDb = async () => {
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to MongoDB:", dbName);

  const usersCollection = db.collection("users");
  await usersCollection.createIndex({ username: 1 }, { unique: true });
};

export const getUsersCollection = (): Collection => db.collection("users");
export const getExercisesCollection = (): Collection =>
  db.collection("exercises");

export { ObjectId };
