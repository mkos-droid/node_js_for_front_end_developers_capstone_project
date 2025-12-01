import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import { sendError } from "./utils/http";

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", userRoutes);

app.use((_req: Request, res: Response) => {
  return sendError(res, 404, "Route not found");
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  return sendError(res, 500, "Internal server error");
});

export default app;
