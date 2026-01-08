import express from "express";
import {
  createNotification,
  getNotificationsByUserId,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationsController.js";

const router = express.Router();

router.post("/", createNotification);
router.put("/read-all", markAllNotificationsRead);
router.put("/:id/read", markNotificationRead);
router.get("/:userId", getNotificationsByUserId);

export default router;
