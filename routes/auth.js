



import express from "express";
import { login, register, logout } from "../controllers/auth.js";

const router = express.Router();

// ✅ Register Route
router.post("/register", register);

// ✅ Login Route
router.post("/login", login);

// ✅ Logout Route
router.post("/logout", logout);

export default router;


