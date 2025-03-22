



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

dotenv.config();

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage Setup
const storage = multer.memoryStorage(); // ✅ Store in memory
const upload = multer({ storage });

// ✅ Cloudinary Upload Handler
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "social_media" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Upload Route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await uploadToCloudinary(req.file.buffer);
    console.log("✅ Cloudinary Upload Successful:", result.secure_url);
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    res.status(500).json({ error: "Failed to upload media." });
  }
});

export default router;
