import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectToDb } from "./db";

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectToDb();
    const listener = app.listen(port, () => {
      console.log(
        "app is listening on port " + (listener.address() as any).port
      );
    });
  } catch (err) {
    console.error("Failed to start app:", err);
    process.exit(1);
  }
};

start();
