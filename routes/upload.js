

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
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage Configuration (optional, for file upload before Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload API
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "social_media" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Error:", error);
          return res.status(500).json({ error: "Upload failed!" });
        }

        console.log("✅ Upload Successful:", result.url);

        // ✅ Return the uploaded Cloudinary URL
        res.status(200).json({ imageUrl: result.secure_url });
      }
    ).end(file.buffer);
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ error: "Error uploading to Cloudinary" });
  }
});

export default router;
