import { sql } from "../config/db.js";

export async function getCategoriesByUserId(req, res) {
  try {
    const { userId } = req.params;

    const categories = await sql`
      SELECT * FROM categories WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(categories);
  } catch (error) {
    console.log("Error getting categories", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createCategory(req, res) {
  try {
    const { user_id, name, icon, color } = req.body;
    const trimmedName = String(name || "").trim();

    if (!user_id || !trimmedName) {
      return res.status(400).json({ message: "user_id and name are required" });
    }

    const result = await sql`
      INSERT INTO categories(user_id, name, icon, color)
      VALUES (${user_id}, ${trimmedName}, ${icon || "pricetag"}, ${color || "#00D09C"})
      ON CONFLICT (user_id, name) DO NOTHING
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(409).json({ message: "Category already exists" });
    }

    res.status(201).json(result[0]);
  } catch (error) {
    console.log("Error creating category", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await sql`
      DELETE FROM categories WHERE id = ${id} AND user_id = ${user_id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log("Error deleting category", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
