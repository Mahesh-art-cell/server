
// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";
// import moment from "moment";
// import { v2 as cloudinary } from "cloudinary";
// import streamifier from "streamifier";

// // ✅ Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Upload to Cloudinary with Auto Detection
// const uploadToCloudinary = (buffer, folder = "stories") => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: "auto", // ✅ Auto-detect whether it's an image, video, or audio
//       },
//       (error, result) => {
//         if (result) {
//           console.log("✅ Cloudinary Upload Successful:", result.secure_url);
//           resolve(result.secure_url); // Return Cloudinary URL
//         } else {
//           console.error("❌ Cloudinary Upload Error:", error.message);
//           reject(error);
//         }
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

// // ✅ Get Stories (Fetch Stories for User and Followed Users)
// export const getStories = (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       return res.status(403).json("Token is not valid!");
//     }

//     console.log("✅ User ID:", userInfo.id);

//     const q = `
//       SELECT s.*, u.name, u.profilePic
//       FROM stories AS s
//       JOIN users AS u ON u.id = s.userId
//       LEFT JOIN relationships AS r 
//       ON s.userId = r.followedUserId AND r.followerUserId = ?
//       ORDER BY s.createdAt DESC
//       LIMIT 4
//     `;

//     db.query(q, [userInfo.id], (err, data) => {
//       if (err) {
//         console.error("❌ Database Error:", err);
//         return res.status(500).json(err);
//       }
//       console.log("✅ Stories Fetched Successfully!");
//       return res.status(200).json(data);
//     });
//   });
// };

// // ✅ Add Story with Cloudinary Media Upload (Image/Video/Audio)
// export const addStory = async (req, res) => {
//   console.log("📥 Incoming Request to Add Story:", req.body);

//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
//     if (err) {
//       return res.status(403).json("Token is not valid!");
//     }

//     // ✅ Check if File is Provided
//     if (!req.file) {
//       console.error("❌ No file provided!");
//       return res.status(400).json("Story file is required!");
//     }

//     let storyUrl;
//     try {
//       // ✅ Upload Media to Cloudinary
//       storyUrl = await uploadToCloudinary(req.file.buffer, "stories");
//     } catch (uploadError) {
//       console.error("❌ Cloudinary Upload Error:", uploadError.message);
//       return res.status(500).json({ error: "Failed to upload story to Cloudinary" });
//     }

//     // ✅ Prepare SQL Query to Insert Story
//     const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
//     const values = [
//       storyUrl,
//       moment().format("YYYY-MM-DD HH:mm:ss"),
//       userInfo.id,
//     ];

//     // ✅ Insert Story into Database
//     db.query(q, [values], (err, data) => {
//       if (err) {
//         console.error("❌ Database Error:", err);
//         return res.status(500).json({ error: "Failed to create story" });
//       }

//       console.log("✅ Story Created Successfully!");
//       return res.status(200).json({
//         message: "Story created successfully",
//         storyUrl,
//       });
//     });
//   });
// };

// // ✅ Delete Story
// export const deleteStory = (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       return res.status(403).json("Token is not valid!");
//     }

//     const storyId = req.params.id;
//     const q = "DELETE FROM stories WHERE `id` = ? AND `userId` = ?";

//     db.query(q, [storyId, userInfo.id], (err, data) => {
//       if (err) {
//         console.error("❌ Database Error:", err);
//         return res.status(500).json("Failed to delete story");
//       }

//       if (data.affectedRows === 0) {
//         return res.status(403).json("You can only delete your own stories!");
//       }

//       console.log("✅ Story Deleted Successfully!");
//       return res.status(200).json("Story has been deleted successfully");
//     });
//   });
// };


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
