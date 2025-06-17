

// routes/upload.js
import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

// ✅ Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ POST /api/upload — Upload single file
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await uploadToCloudinary(req.file.buffer);
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("❌ Upload Error:", error.message);
    res.status(500).json({ error: "Upload failed." });
  }
});

export default router;
