import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.get("/streams", async (_req, res) => {
  try {
    const result = await pool.query("SELECT id, name, status FROM streams");

    res.json({ streams: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
