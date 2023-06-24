import express from "express";

import { verifyToken } from "../middlewares/index.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", (req, res) => {
  res.send("hello from REVIEW controller");
});

export default router;
