import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload"); // ✅ Save files in /public/upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });

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



// import express from "express";
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";

// const router = express.Router();

// // ✅ Define file upload storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/upload"); // Uploads go to /public/upload
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const upload = multer({ storage: storage });

// // ✅ POST: Handle file upload
// router.post("/", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded." });
//   }

//   // ✅ Return uploaded file's path
//   res.status(200).json({
//     filename: req.file.filename,
//     message: "✅ File uploaded successfully!",
//   });
// });

// export default router;
