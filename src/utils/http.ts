import { Response } from "express";
import { ErrorResponse } from "../types";

export const sendError = (res: Response, status: number, message: string) => {
  const body: ErrorResponse = { error: message };
  return res.status(status).json(body);
};
