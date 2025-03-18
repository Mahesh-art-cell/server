
// import express from "express";
// import multer from "multer";
// import { getUser, updateUser } from "../controllers/user.js";
// import { verifyToken } from "../middleware/verifyToken.js"; 

// const router = express.Router();

// // ✅ Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/upload");
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

// router.get("/test", (req, res) => {
//   res.send("User API is working");
// });

// // ✅ Upload profile/cover image
// router.post("/upload/:userId", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
//   res.status(200).json({ filename: req.file.filename });
// });

// export default router;



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

// ✅ Protect update route with verifyToken
router.put("/:userId", verifyToken, updateUser);

// ✅ Test Route
router.get("/test", (req, res) => {
  res.send("User API is working");
});

// ✅ Upload profile/cover image (POST /api/users/upload/:userId)
router.post("/upload/:userId", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
  res.status(200).json({ filename: req.file.filename });
});

export default router;
