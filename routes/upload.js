import express from "express";
import { uploadFile } from "../controllers/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// POST /api/upload - Upload a file
router.post("/", verifyToken, uploadFile);

export default router;