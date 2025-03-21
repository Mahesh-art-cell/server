

// import express from "express";
// import multer from "multer";
// import path from "path";

// const router = express.Router();

// // ✅ Define storage location and filename for uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/upload"); // ✅ Save to /public/upload folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const upload = multer({ storage: storage });

// // ✅ Handle File Upload - POST /upload
// router.post("/", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded." });
//   }

//   res.status(200).json({
//     filename: req.file.filename,
//     message: "File uploaded successfully",
//   });
// });

// export default router;




import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config();
const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Upload to Cloudinary
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mern-social-media",
    });

    // ✅ Remove file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
