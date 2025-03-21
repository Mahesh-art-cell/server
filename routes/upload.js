

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
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// ✅ Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload to Cloudinary
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded!");
    }

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "social_app" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return res.status(500).json("Upload to Cloudinary failed.");
        }
        res.status(200).json({ imageUrl: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (error) {
    console.error("❌ Error during upload:", error);
    res.status(500).json("Internal Server Error.");
  }
});

export default router;
