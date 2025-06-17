// import express from "express";
// import { v2 as cloudinary } from "cloudinary";
// import multer from "multer";
// import dotenv from "dotenv";
// import { db } from "../connect.js";

// dotenv.config();

// const router = express.Router();

// // ✅ Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Multer Configuration (Memory Storage)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // ✅ Upload Media to Cloudinary and Save URL in DB
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // ✅ Upload to Cloudinary
//     cloudinary.uploader.upload_stream(
//       { resource_type: "auto", folder: "social_media" },
//       (error, result) => {
//         if (error) {
//           console.error("❌ Cloudinary Upload Error:", error);
//           return res.status(500).json({ error: "Failed to upload media" });
//         }

//         // ✅ Insert into media table in DB
//         const q = "INSERT INTO media (`url`, `type`, `created_at`) VALUES (?)";
//         const values = [
//           result.secure_url,
//           result.resource_type === "image" ? "image" : "video",
//           new Date(),
//         ];

//         db.query(q, [values], (err, data) => {
//           if (err) {
//             console.error("❌ Database Error:", err);
//             return res.status(500).json({ error: "Failed to save media info" });
//           }

//           res.status(200).json({
//             message: "Media uploaded successfully!",
//             mediaId: data.insertId,
//           });
//         });
//       }
//     ).end(file.buffer);
//   } catch (error) {
//     console.error("❌ Upload Error:", error);
//     res.status(500).json({ error: "Error uploading media" });
//   }
// });

// // ✅ Get All Media
// router.get("/", (req, res) => {
//   const q = "SELECT * FROM media ORDER BY created_at DESC";

//   db.query(q, (err, data) => {
//     if (err) {
//       console.error("❌ Database Error:", err);
//       return res.status(500).json({ error: "Failed to fetch media" });
//     }
//     res.status(200).json(data);
//   });
// });

// export default router;
