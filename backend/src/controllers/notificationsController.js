import { sql } from "../config/db.js";

export async function getNotificationsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const notifications = await sql`
      SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error getting notifications", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNotification(req, res) {
  try {
    const { user_id, type, title, message } = req.body;
    const trimmedType = String(type || "").trim();
    const trimmedTitle = String(title || "").trim();
    const trimmedMessage = String(message || "").trim();

    if (!user_id || !trimmedType || !trimmedTitle || !trimmedMessage) {
      return res.status(400).json({ message: "user_id, type, title, message are required" });
    }

    const notification = await sql`
      INSERT INTO notifications(user_id, type, title, message)
      VALUES (${user_id}, ${trimmedType}, ${trimmedTitle}, ${trimmedMessage})
      RETURNING *
    `;

    res.status(201).json(notification[0]);
  } catch (error) {
    console.log("Error creating notification", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await sql`
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = ${id} AND user_id = ${user_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.log("Error updating notification", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function markAllNotificationsRead(req, res) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await sql`
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = ${user_id} AND is_read = FALSE
      RETURNING id
    `;

    res.status(200).json({ updated: result.length });
  } catch (error) {
    console.log("Error updating notifications", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
