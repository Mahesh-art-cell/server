import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // from .env
  api_key: process.env.CLOUD_API_KEY, // from .env
  api_secret: process.env.CLOUD_API_SECRET, // from .env
});

// ✅ Upload Image to Cloudinary
export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'mern-app', // Optional: Upload folder name
    });
    return result.secure_url; // Return uploaded file URL
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error);
    throw error;
  }
};
