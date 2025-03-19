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
import path from "path";

const router = express.Router();

// ✅ Define storage location and filename for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload"); // ✅ Save to /public/upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
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
