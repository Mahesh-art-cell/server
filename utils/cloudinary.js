// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";
// dotenv.config();

// // ✅ Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// // ✅ Upload File to Cloudinary and Return URL
// export const uploadToCloudinary = async (filePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: "mern-app", // Optional: Folder name in Cloudinary
//     });
//     return result.secure_url; // ✅ Return uploaded file's URL
//   } catch (error) {
//     console.error("❌ Cloudinary Upload Error:", error);
//     throw error;
//   }
// };


import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// ✅ Log Cloudinary Config
console.log("📢 Cloudinary Config:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET ? "********" : "undefined",
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary.v2;
