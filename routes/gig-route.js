import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello from GIG controller");
});

export default router;
