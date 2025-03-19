import express from "express";
import multer from "multer";
import path from "path";
import { uploadFile, handleUploadError } from "../controllers/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../public/upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created upload directory:", uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Upload middleware
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Test route to check if upload route is working
router.get("/test", (req, res) => {
  res.json({ message: "Upload route is working" });
});

// Upload route with error handling
router.post("/", verifyToken, (req, res, next) => {
  const uploadMiddleware = upload.single("file");
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error("Upload middleware error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadFile);

export default router;