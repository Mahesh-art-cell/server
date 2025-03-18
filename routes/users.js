
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

// // ✅ Protect update route with verifyToken
// router.put("/:userId", verifyToken, updateUser);

// // ✅ Test Route
// router.get("/test", (req, res) => {
//   res.send("User API is working");
// });

// // ✅ Upload profile/cover image (POST /api/users/upload/:userId)
// router.post("/upload/:userId", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
//   res.status(200).json({ filename: req.file.filename });
// });

// export default router;



// user.js (routes)
import express from "express";
import multer from "multer";
import path from "path";
import { getUser, updateUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload"); // ✅ Ensure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Get user by ID
router.get("/find/:userId", getUser);

// ✅ Protect update route with verifyToken AND handle file upload
router.put("/:userId", verifyToken, updateUser);

// ✅ Upload profile/cover image (POST /api/users/upload/:userId)
router.post("/upload/:userId", verifyToken, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
  
  // Return the full path that can be used in the frontend
  const filePath = req.file.filename;
  res.status(200).json({ filename: filePath });
});

export default router;