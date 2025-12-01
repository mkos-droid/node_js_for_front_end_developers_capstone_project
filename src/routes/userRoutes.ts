import { Router } from "express";
import {
  getHomePage,
  postUser,
  getUsers,
  postExercise,
  getUserLogsController,
} from "../controllers/userController";

const router = Router();

router.get("/", getHomePage);

router.post("/api/users", postUser);
router.get("/api/users", getUsers);

router.post("/api/users/:_id/exercises", postExercise);
router.get("/api/users/:_id/logs", getUserLogsController);

export default router;
