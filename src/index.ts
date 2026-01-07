import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import healthRoutes from "./routes/health";
import streamRoutes from "./routes/streams";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use(streamRoutes);

const server = createServer(app);

const wss = new WebSocketServer({ server });

const viewers: Record<string, number> = {};

wss.on("connection", (socket, req) => {
  const url = new URL(req.url || "", "http://localhost");
  const streamId = url.searchParams.get("streamId");

  if (!streamId) {
    socket.close();
    return;
  }

  viewers[streamId] = (viewers[streamId] || 0) + 1;

  // broadcast count
  broadcast(streamId);

  socket.on("close", () => {
    viewers[streamId] = Math.max((viewers[streamId] || 1) - 1, 0);
    broadcast(streamId);
  });
});

function broadcast(streamId: string) {
  const count = viewers[streamId] || 0;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(
        JSON.stringify({
          streamId,
          viewers: count,
        })
      );
    }
  });
}

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
