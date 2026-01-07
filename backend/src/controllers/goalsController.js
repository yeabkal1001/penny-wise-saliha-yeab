import { sql } from "../config/db.js";

export async function getGoalsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const goals = await sql`
      SELECT * FROM goals WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(goals);
  } catch (error) {
    console.log("Error getting goals", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createGoal(req, res) {
  try {
    const { user_id, name, target_amount, current_amount, icon } = req.body;
    const trimmedName = String(name || "").trim();
    const parsedTarget = Number(target_amount);
    const parsedCurrent = Number(current_amount ?? 0);

    if (!user_id || !trimmedName || Number.isNaN(parsedTarget)) {
      return res.status(400).json({ message: "user_id, name, target_amount are required" });
    }

    const goal = await sql`
      INSERT INTO goals(user_id, name, target_amount, current_amount, icon)
      VALUES (${user_id}, ${trimmedName}, ${parsedTarget}, ${Number.isNaN(parsedCurrent) ? 0 : parsedCurrent}, ${icon || "trophy"})
      RETURNING *
    `;

    res.status(201).json(goal[0]);
  } catch (error) {
    console.log("Error creating goal", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateGoal(req, res) {
  try {
    const { id } = req.params;
    const { user_id, target_amount, current_amount, icon } = req.body;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid goal ID" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    if (target_amount !== undefined && Number.isNaN(Number(target_amount))) {
      return res.status(400).json({ message: "target_amount must be a number" });
    }

    if (current_amount !== undefined && Number.isNaN(Number(current_amount))) {
      return res.status(400).json({ message: "current_amount must be a number" });
    }

    const result = await sql`
      UPDATE goals
      SET target_amount = COALESCE(${target_amount}, target_amount),
          current_amount = COALESCE(${current_amount}, current_amount),
          icon = COALESCE(${icon}, icon)
      WHERE id = ${id} AND user_id = ${user_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.log("Error updating goal", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteGoal(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid goal ID" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await sql`
      DELETE FROM goals WHERE id = ${id} AND user_id = ${user_id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.log("Error deleting goal", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
