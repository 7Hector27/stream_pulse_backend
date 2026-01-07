import { Router } from "express";

const router = Router();

type Stream = {
  id: string;
  name: string;
  status: "LIVE" | "OFFLINE";
  viewers?: number;
};

const streams: Stream[] = [
  { id: "1", name: "Morning Radio", status: "LIVE", viewers: 127 },
  { id: "2", name: "Evening Talk", status: "OFFLINE" },
  { id: "3", name: "Late Nigh Talk Show", status: "OFFLINE" },
  { id: "4", name: "Kiss Radio", status: "LIVE", viewers: 67 },
];

router.get("/streams", (_req, res) => {
  res.json({ streams });
});

export default router;
