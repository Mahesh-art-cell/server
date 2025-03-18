


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
import { getUser, updateUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Improved Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// ✅ File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ✅ Get user by ID
router.get("/find/:userId", getUser);

// ✅ Protect update route with verifyToken
router.put("/:userId", verifyToken, updateUser);

// ✅ Improved upload route
router.post("/upload/:userId", verifyToken, (req, res, next) => {
  // Ensure the user is updating their own profile
  if (req.userInfo.id != req.params.userId) {
    return res.status(403).json("You can only upload to your own profile!");
  }
  next();
}, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded!" });
  }
  
  console.log("✅ File uploaded successfully:", req.file.filename);
  
  // Return the filename to be stored in the database
  res.status(200).json({ 
    filename: req.file.filename,
    message: "File uploaded successfully" 
  });
});

export default router;