import express from "express";
import { searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", searchUsers); // GET /api/users/search?q=...

export default router;
