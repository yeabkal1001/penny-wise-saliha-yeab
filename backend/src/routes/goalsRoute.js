import express from "express";
import {
  createGoal,
  deleteGoal,
  getGoalsByUserId,
  updateGoal,
} from "../controllers/goalsController.js";

const router = express.Router();

router.get("/:userId", getGoalsByUserId);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
