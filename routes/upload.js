

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




// ✅ Upload Route with Cloudinary
import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js"; // ✅ Import Cloudinary

const router = express.Router();

// ✅ Configure Multer to store file temporarily
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ✅ Cloudinary Upload API
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // ✅ Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "social_media_uploads", // Optional: Organize files into a folder
      resource_type: "auto", // Detect image or video
    });

    console.log("✅ File Uploaded to Cloudinary:", result.url);

    // ✅ Return URL to frontend
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    res.status(500).json({ error: "Failed to upload file to Cloudinary." });
  }
});

export default router;
