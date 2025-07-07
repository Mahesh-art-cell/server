


import jwt from "jsonwebtoken";
import moment from "moment";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Story from "../models/Story.js";
import User from "../models/User.js";
import Relationship from "../models/Relationship.js";

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder = "stories") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Get Stories (Self + Followed)
export const getStories = async (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const followedUsers = await Relationship.find({ followerUserId: userInfo.id }).select("followedUserId");
    const followedIds = followedUsers.map((r) => r.followedUserId.toString());

    const stories = await Story.find({
      userId: { $in: [...followedIds, userInfo.id] },
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("userId", "name profilePic");

    res.status(200).json(stories);
  } catch (err) {
    console.error("❌ Error fetching stories:", err.message);
    res.status(500).json("Something went wrong");
  }
};

// ✅ Add Story
export const addStory = async (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.file) return res.status(400).json("Story file is required");

    const storyUrl = await uploadToCloudinary(req.file.buffer, "stories");

    const newStory = new Story({
      img: storyUrl,
      createdAt: moment().toDate(),
      userId: userInfo.id,
    });

    await newStory.save();

    res.status(200).json({ message: "Story created successfully", storyUrl });
  } catch (err) {
    console.error("❌ Error creating story:", err.message);
    res.status(500).json("Failed to create story");
  }
};

// ✅ Delete Story
export const deleteStory = async (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    const story = await Story.findOneAndDelete({ _id: req.params.id, userId: userInfo.id });

    if (!story) return res.status(403).json("You can only delete your own stories!");

    res.status(200).json("Story has been deleted successfully");
  } catch (err) {
    console.error("❌ Error deleting story:", err.message);
    res.status(500).json("Failed to delete story");
  }
};
