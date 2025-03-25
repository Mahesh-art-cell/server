

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Cloudinary Upload Handler
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Cloudinary Upload Route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await uploadToCloudinary(req.file.buffer);
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
});

export default router;
