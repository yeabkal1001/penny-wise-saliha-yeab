import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoriesByUserId,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/:userId", getCategoriesByUserId);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

export default router;
