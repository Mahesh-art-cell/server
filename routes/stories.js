

import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";

const router = express.Router();

// ✅ Multer Configuration to Store File in Memory for Cloudinary Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Get Stories (Authenticated)
router.get("/", verifyToken, getStories);

// ✅ Add Story with Media Upload (Image, Video, Audio)
router.post("/", verifyToken, upload.single("file"), addStory);

// ✅ Delete Story (Authenticated)
router.delete("/:id", verifyToken, deleteStory);

export default router;
