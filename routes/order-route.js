import express from "express";
// import { deleteUser } from "../controllers/index.js";

const router = express.Router();

// deleteUser
router.get("/", (req, res) => {
  res.send("hello from ORDER controller");
});

export default router;
