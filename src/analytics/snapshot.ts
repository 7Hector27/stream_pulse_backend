import { Pool } from "pg";
import { pool } from "../db";

export async function snapshotViewerCount(
  streamId: string,
  viewerCount: number
) {
  await pool.query(
    `
        INSERT INTO viewer_metrics (stream_id, viewer_count) 
        VALUES ($1, $2)
        `,
    [streamId, viewerCount]
  );
}
