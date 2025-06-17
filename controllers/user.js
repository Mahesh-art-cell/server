
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result.secure_url);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Delete image from Cloudinary
const deleteFromCloudinary = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith("http")) return;
  const parts = imageUrl.split("/");
  const publicId = parts[parts.length - 1].split(".")[0];
  return cloudinary.uploader.destroy(`${parts[parts.length - 2]}/${publicId}`);
};

// ✅ Get a single user (excluding password)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json("User not found");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// ✅ Update a user (with optional image update)
export const updateUser = async (req, res) => {
  const userId = req.params.userId;

  if (req.userInfo.id !== userId) {
    return res.status(403).json("You can update only your own profile!");
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found!");

    // Upload new profilePic
    let profilePicUrl = user.profilePic;
    if (req.files?.profilePic?.[0]) {
      try {
        if (user.profilePic) await deleteFromCloudinary(user.profilePic);
        profilePicUrl = await uploadToCloudinary(
          req.files.profilePic[0].buffer,
          "profile_pics"
        );
        console.log("✅ Uploaded profilePic:", profilePicUrl);
      } catch (err) {
        console.error("❌ Failed to upload profilePic:", err.message);
      }
    }

    // Upload new coverPic
    let coverPicUrl = user.coverPic;
    if (req.files?.coverPic?.[0]) {
      try {
        if (user.coverPic) await deleteFromCloudinary(user.coverPic);
        coverPicUrl = await uploadToCloudinary(
          req.files.coverPic[0].buffer,
          "cover_pics"
        );
        console.log("✅ Uploaded coverPic:", coverPicUrl);
      } catch (err) {
        console.error("❌ Failed to upload coverPic:", err.message);
      }
    }

    // Update user document
    const updated = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        username: req.body.username || user.username,
        profilePic: profilePicUrl,
        coverPic: coverPicUrl,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "User updated successfully!",
      user: updated,
    });
  } catch (err) {
    console.error("❌ Update User Error:", err.message);
    res.status(500).json({ error: "Update failed", message: err.message });
  }
};


// ✅ Get all users (auth required)
export const getAllUsers = async (req, res) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json("Not logged in!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Get All Users Error:", err.message);
    res.status(403).json({ error: "Invalid token" });
  }
};
