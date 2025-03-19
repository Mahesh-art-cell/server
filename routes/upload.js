import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Create 'public/upload' directory if it doesn't exist
const uploadDir = "public/upload";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Upload directory created: public/upload");
}

// ✅ Define storage location and filename for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // ✅ Save to /public/upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// ✅ Configure Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB size limit
  },
  fileFilter: (req, file, cb) => {
    // ✅ Accept only images
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("❌ Only images are allowed!"));
    }
  },
});

// ✅ Handle File Upload - POST /upload
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  res.status(200).json({
    filename: req.file.filename,
    message: "✅ File uploaded successfully!",
  });
});

export default router;
