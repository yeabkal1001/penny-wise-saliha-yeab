import express from "express";
import {
  createBudget,
  deleteBudget,
  getBudgetsByUserId,
  updateBudget,
} from "../controllers/budgetsController.js";

const router = express.Router();

router.get("/:userId", getBudgetsByUserId);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;
