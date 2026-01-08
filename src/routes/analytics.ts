import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.get("/analytics", async (_req, res) => {
  const result = await pool.query(
    `
        SELECT * FROM viewer_metrics
        WHERE recorded_at >= NOW() - INTERVAL '24 hours'
        ORDER BY recorded_at ASC
        `
  );

  res.json({ data: result.rows });
});

export default router;
