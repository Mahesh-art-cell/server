import express from "express";
import { login,register,logout } from "../controllers/auth.js";

const router = express.Router()

router.post("/login", login)
router.post("/register", register)


// ✅ Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false, // ✅ Set to true in production (with HTTPS)
    sameSite: "lax", // ✅ "none" if HTTPS is used
  });
  return res.status(200).json("Logged out successfully!");
});

export default router;

