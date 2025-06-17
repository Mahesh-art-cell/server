


import Post from "../models/Post.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload buffer
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "social_media" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Get Posts (all or by userId)
export const getPosts = async (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = req.query;

    const filter = userId ? { userId } : {};
    const posts = await Post.find(filter)
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(403).json({ error: "Token is not valid", message: err.message });
  }
};

// ✅ Add Post
export const addPost = async (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json("Content is required");

    let imgUrl = null;
    if (req.file) {
      try {
        imgUrl = await uploadToCloudinary(req.file.buffer);
      } catch (uploadErr) {
        return res.status(500).json({ error: "Image upload failed", message: uploadErr.message });
      }
    }

    const newPost = new Post({
      userId: userInfo.id,
      content,
      img: imgUrl || null,
    });

    await newPost.save();
    res.status(200).json({ message: "Post created", post: newPost });
  });
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("Post not found");
    if (post.userId.toString() !== userInfo.id) return res.status(403).json("Unauthorized");

    await post.deleteOne();
    res.status(200).json("Post deleted successfully");
  } catch (err) {
    res.status(500).json({ error: "Delete failed", message: err.message });
  }
};
