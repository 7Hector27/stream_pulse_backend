import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health";
import streamRoutes from "./routes/streams";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use(streamRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
