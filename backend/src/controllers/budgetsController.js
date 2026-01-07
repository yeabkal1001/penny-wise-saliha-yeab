import { sql } from "../config/db.js";

export async function getBudgetsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const budgets = await sql`
      SELECT * FROM budgets WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(budgets);
  } catch (error) {
    console.log("Error getting budgets", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createBudget(req, res) {
  try {
    const { user_id, category, amount, period, alert_threshold } = req.body;
    const trimmedCategory = String(category || "").trim();
    const parsedAmount = Number(amount);
    const parsedAlert = Number(alert_threshold ?? 0);

    if (!user_id || !trimmedCategory || Number.isNaN(parsedAmount)) {
      return res.status(400).json({ message: "user_id, category, amount are required" });
    }

    const budget = await sql`
      INSERT INTO budgets(user_id, category, amount, period, alert_threshold)
      VALUES (${user_id}, ${trimmedCategory}, ${parsedAmount}, ${period || "monthly"}, ${Number.isNaN(parsedAlert) ? 0 : parsedAlert})
      RETURNING *
    `;

    res.status(201).json(budget[0]);
  } catch (error) {
    console.log("Error creating budget", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateBudget(req, res) {
  try {
    const { id } = req.params;
    const { user_id, amount, period, alert_threshold } = req.body;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid budget ID" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    if (amount !== undefined && Number.isNaN(Number(amount))) {
      return res.status(400).json({ message: "amount must be a number" });
    }

    if (alert_threshold !== undefined && Number.isNaN(Number(alert_threshold))) {
      return res.status(400).json({ message: "alert_threshold must be a number" });
    }

    const result = await sql`
      UPDATE budgets
      SET amount = COALESCE(${amount}, amount),
          period = COALESCE(${period}, period),
          alert_threshold = COALESCE(${alert_threshold}, alert_threshold)
      WHERE id = ${id} AND user_id = ${user_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.log("Error updating budget", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteBudget(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid budget ID" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await sql`
      DELETE FROM budgets WHERE id = ${id} AND user_id = ${user_id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.log("Error deleting budget", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
