


// // user.js (routes)
// import express from "express";
// import multer from "multer";
// import path from "path";
// import { getUser, updateUser } from "../controllers/user.js";
// import { verifyToken } from "../middleware/verifyToken.js";

// const router = express.Router();

// // ✅ Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/upload"); // ✅ Ensure folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // ✅ Get user by ID
// router.get("/find/:userId", getUser);

// // ✅ Protect update route with verifyToken AND handle file upload
// router.put("/:userId", verifyToken, updateUser);

// // ✅ Upload profile/cover image (POST /api/users/upload/:userId)
// router.post("/upload/:userId", verifyToken, upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
  
//   // Return the full path that can be used in the frontend
//   const filePath = req.file.filename;
//   res.status(200).json({ filename: filePath });
// });

// export default router;


import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getUser, updateUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "public/upload";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Improved Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the verified directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Increased to 10MB limit
});

// Get user by ID
router.get("/find/:userId", getUser);

// Protect update route with verifyToken
router.put("/:userId", verifyToken, updateUser);

// Improved upload route with better error handling
router.post("/upload/:userId", verifyToken, (req, res, next) => {
  try {
    // Ensure the user is updating their own profile
    if (req.userInfo.id != req.params.userId) {
      return res.status(403).json({ error: "You can only upload to your own profile!" });
    }
    next();
  } catch (err) {
    console.error("❌ Authentication error:", err);
    return res.status(500).json({ error: "Authentication error" });
  }
}, (req, res) => {
  // Handle the file upload with custom error handling
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("❌ Upload error:", err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File too large! Max size is 10MB." });
      }
      return res.status(400).json({ error: err.message || "Error uploading file" });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded or file not recognized as an image!" });
    }
    
    console.log("✅ File uploaded successfully:", req.file.filename);
    
    // Return the filename to be stored in the database
    res.status(200).json({ 
      filename: req.file.filename,
      message: "File uploaded successfully" 
    });
  });
});

export default router;