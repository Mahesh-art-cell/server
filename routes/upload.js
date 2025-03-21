

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
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

const router = express.Router();

// ✅ Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save locally before uploading to Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Upload Route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No File Uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📸 Uploading to Cloudinary...");

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
