

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
import path from "path";

const router = express.Router();

// ✅ Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save locally before sending to Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// ✅ Handle File Upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("✅ File Received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mern-social-app", // Change folder if needed
    });

    console.log("✅ Cloudinary Upload Success:", result);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Error in Upload Route:", error.message);
    res.status(500).json({ error: "Failed to upload file." });
  }
});

export default router;
