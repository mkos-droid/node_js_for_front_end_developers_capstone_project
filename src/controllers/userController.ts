import { Request, Response } from "express";
import path from "path";
import { CreatedExerciseResponse, UserExerciseLog, User } from "../types";
import { sendError } from "../utils/http";
import { isValidDateString } from "../utils/validation";
import { ObjectId } from "../db";
import {
  createUser,
  getAllUsers,
  getUserById,
  DbUser,
} from "../services/userService";
import { createExercise, getUserLogs } from "../services/exerciseService";

export const getHomePage = (_req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "views", "index.html"));
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const username = String(req.body.username || "").trim();

    if (!username) {
      return sendError(res, 400, "username is required");
    }

    try {
      const user: User = await createUser(username);
      return res.status(201).json(user);
    } catch (err: any) {
      console.error(err);
      if (err && err.code === 11000) {
        return sendError(res, 400, "username already exists");
      }
      return sendError(res, 500, "Internal server error");
    }
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
};

const getUserOrError = async (
  req: Request,
  res: Response
): Promise<DbUser | undefined> => {
  const idParam = req.params._id;

  if (!ObjectId.isValid(idParam)) {
    sendError(res, 400, "invalid user id");
    return undefined;
  }

  const user = await getUserById(idParam);

  if (!user) {
    sendError(res, 404, "user not found");
    return undefined;
  }

  return user;
};

export const postExercise = async (req: Request, res: Response) => {
  try {
    const user = await getUserOrError(req, res);
    if (!user) return;

    const description = String(req.body.description || "").trim();
    const durationRaw = req.body.duration;
    const dateRaw = (req.body.date as string | undefined)?.trim();

    if (!description) {
      return sendError(res, 400, "description is required");
    }

    const duration = Number(durationRaw);
    if (!Number.isInteger(duration) || duration <= 0) {
      return sendError(res, 400, "duration must be a positive integer");
    }

    let dateString: string;
    if (!dateRaw) {
      dateString = new Date().toISOString().slice(0, 10);
    } else {
      if (!isValidDateString(dateRaw)) {
        return sendError(res, 400, "date must be in format YYYY-MM-DD");
      }
      dateString = dateRaw;
    }

    const { exerciseId } = await createExercise({
      userId: user._id,
      description,
      duration,
      date: dateString,
    });

    const response: CreatedExerciseResponse = {
      userId: user._id.toString(),
      exerciseId,
      description,
      duration,
      date: dateString,
    };

    return res.status(201).json(response);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
};

export const getUserLogsController = async (req: Request, res: Response) => {
  try {
    const user = await getUserOrError(req, res);
    if (!user) return;

    const fromStr = req.query.from as string | undefined;
    const toStr = req.query.to as string | undefined;
    const limitStr = req.query.limit as string | undefined;

    if (fromStr && !isValidDateString(fromStr)) {
      return sendError(res, 400, "from must be in format YYYY-MM-DD");
    }
    if (toStr && !isValidDateString(toStr)) {
      return sendError(res, 400, "to must be in format YYYY-MM-DD");
    }

    let limit: number | undefined;
    if (limitStr !== undefined) {
      const parsed = Number(limitStr);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        return sendError(res, 400, "limit must be a positive integer");
      }
      limit = parsed;
    }

    const { logs, count } = await getUserLogs({
      userId: user._id,
      from: fromStr,
      to: toStr,
      limit,
    });

    const response: UserExerciseLog = {
      id: user._id.toString(),
      username: user.username,
      logs,
      count,
    };

    return res.json(response);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Internal server error");
  }
};
