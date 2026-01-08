import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import healthRoutes from "./routes/health";
import streamRoutes from "./routes/streams";
import analyticsRoutes from "./routes/analytics";
import { redis } from "./redis";

import { snapshotViewerCount } from "./analytics/snapshot";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use(streamRoutes);
app.use(analyticsRoutes);

const server = createServer(app);

const wss = new WebSocketServer({ server });

// const viewers: Record<string, number> = {};

wss.on("connection", async (socket, req) => {
  const url = new URL(req.url || "", "http://localhost");
  const streamId = url.searchParams.get("streamId");

  if (!streamId) {
    socket.close();
    return;
  }

  const key = `stream:viewers:${streamId}`;
  await redis.incr(key);

  const count = Number(await redis.get(key));

  // broadcast count
  broadcast(streamId, count);

  socket.on("close", async () => {
    await redis.decr(key);
    const next = Math.max(Number(await redis.get(key)) || 0, 0);
    broadcast(streamId, next);
  });
});

function broadcast(streamId: string, count: number) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ streamId, viewers: count }));
    }
  });
}

setInterval(async () => {
  const keys = await redis.keys("stream:viewers:*");

  for (const key of keys) {
    const streamId = key.split(":")[2];
    const count = Number(await redis.get(key));
    await snapshotViewerCount(streamId, count);
  }
}, 60_000);

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
