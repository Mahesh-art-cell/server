



// // ✅ Upload Route with Cloudinary
// import express from "express";
// import multer from "multer";
// import cloudinary from "../utils/cloudinary.js"; // ✅ Import Cloudinary

// const router = express.Router();

// // ✅ Configure Multer to store file temporarily
// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// // ✅ Cloudinary Upload API
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     // ✅ Upload file to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "social_media_uploads", // Optional: Organize files into a folder
//       resource_type: "auto", // Detect image or video
//     });

//     console.log("✅ File Uploaded to Cloudinary:", result.url);

//     // ✅ Return URL to frontend
//     res.status(200).json({ url: result.secure_url });
//   } catch (error) {
//     console.error("❌ Cloudinary Upload Error:", error);
//     res.status(500).json({ error: "Failed to upload file to Cloudinary." });
//   }
// });

// export default router;


import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config(); // ✅ Load environment variables

const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Setup to Store in Memory
const storage = multer.memoryStorage(); // ✅ Store image in memory as buffer
const upload = multer({ storage });

// ✅ Upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "social_media" }, // ✅ Cloudinary folder name
      (error, result) => {
        if (result) {
          console.log("✅ Uploaded to Cloudinary:", result.secure_url);
          resolve(result);
        } else {
          console.error("❌ Cloudinary Upload Error:", error);
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream); // ✅ Send file buffer to Cloudinary
  });
};

// ✅ Upload Route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // ✅ Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    console.log("✅ Cloudinary URL:", result.secure_url);

    // ✅ Return Cloudinary URL
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("❌ Upload Failed:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
});

export default router;
