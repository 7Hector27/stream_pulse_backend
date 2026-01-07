import { Router } from "express";

const router = Router();

type Stream = {
  id: string;
  name: string;
  status: "LIVE" | "OFFLINE";
  viewers?: number;
};

const streams: Stream[] = [
  { id: "1", name: "Morning Radio", status: "LIVE", viewers: 128 },
  { id: "2", name: "Evening Talk", status: "OFFLINE" },
];

router.get("/streams", (_req, res) => {
  res.json({ streams });
});

export default router;
