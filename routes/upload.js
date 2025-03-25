


// // 📢 Import Required Libraries
// import express from "express";
// import { v2 as cloudinary } from "cloudinary";
// import multer from "multer";
// import dotenv from "dotenv";
// import streamifier from "streamifier";

// dotenv.config(); // ✅ Load .env variables

// // ✅ Debug Environment Variables (Add Here)
// console.log("✅ Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("✅ API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("✅ API Secret:", process.env.CLOUDINARY_API_SECRET);

// // ✅ Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // ✅ Correct Key
//   api_key: process.env.CLOUDINARY_API_KEY,       // ✅ Correct Key
//   api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ Correct Key


// });

// // ✅ Multer Storage Setup
// const storage = multer.memoryStorage(); // ✅ Store file in memory
// const upload = multer({ storage });

// // ✅ Function to Upload to Cloudinary
// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: "social_media", // ✅ Folder where the image is stored
//       },
//       (error, result) => {
//         if (result) {
//           console.log("✅ Cloudinary Upload Successful:", result.secure_url);
//           resolve(result);
//         } else {
//           console.error("❌ Cloudinary Upload Error:", error.message);
//           reject(error);
//         }
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream); // ✅ Pipe buffer to Cloudinary
//   });
// };

// // ✅ Upload Route
// const router = express.Router();
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     console.log("📢 Incoming Upload Request...");

//     // ✅ Check if a file was uploaded
//     if (!req.file) {
//       console.error("❌ No file received!");
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     console.log("📢 Uploading to Cloudinary...");
//     const result = await uploadToCloudinary(req.file.buffer);

//     console.log("✅ Cloudinary Upload URL:", result.secure_url);
//     res.status(200).json({ url: result.secure_url });
//   } catch (error) {
//     console.error("❌ Upload Error:", error.message);
//     res.status(500).json({ error: "Failed to upload media." });
//   }
// });

// export default router;





