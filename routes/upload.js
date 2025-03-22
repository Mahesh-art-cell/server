



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
import multer from "multer";
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

// ✅ Multer Storage (Optional if Cloudinary is used directly)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique filename
  },
});

// ✅ Multer Middleware to Handle File Uploads
const upload = multer({ storage });

// ✅ POST /upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // ✅ Check if file exists
    if (!req.file) {
      console.error("❌ No file received on the backend.");
      return res.status(400).json({ error: "No file received." });
    }

    console.log("📢 File received on backend:", req.file.path);

    // ✅ Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    console.log("✅ Cloudinary Upload Successful:", result.secure_url);

    // ✅ Return Cloudinary File URL
    res.status(200).json({ url: result.secure_url });

    // ✅ Delete File after Upload (optional)
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error("❌ Upload Error on Cloudinary:", err);
    res.status(500).json({ error: "Failed to upload file." });
  }
});

export default router;
