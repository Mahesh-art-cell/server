

// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";
// import moment from "moment";

// // ✅ Get Posts (feed or by userId)
// export const getPosts = (req, res) => {
//   const userId = req.query.userId;
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     console.error("❌ No Token Provided!");
//     return res.status(401).json("Not logged in!");
//   }

//   try {
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("✅ Token Verified - User Info:", userInfo);

//     let q;
//     let values;

//     if (userId) {
//       // ✅ Get posts for a specific user
//       q = `
//         SELECT p.*, u.id AS userId, u.name, u.profilePic 
//         FROM posts AS p 
//         JOIN users AS u ON (p.userId = u.id)
//         WHERE p.userId = ? 
//         ORDER BY p.createdAt DESC
//       `;
//       values = [userId];
//     } else {
//       // ✅ Get feed posts (from user and followed users)
//       q = `
//         SELECT p.*, u.id AS userId, u.name, u.profilePic 
//         FROM posts AS p 
//         JOIN users AS u ON (p.userId = u.id)
//         LEFT JOIN relationships AS r ON (p.userId = r.followedUserId)
//         WHERE p.userId = ? OR r.followerUserId = ?
//         GROUP BY p.id
//         ORDER BY p.createdAt DESC
//       `;
//       values = [userInfo.id, userInfo.id];
//     }

//     console.log("📢 SQL Query:", q);
//     console.log("📢 Query Values:", values);

//     db.query(q, values, (err, data) => {
//       if (err) {
//         console.error("❌ Database Error:", err);
//         return res.status(500).json("Database error!");
//       }

//       console.log("✅ Posts Fetched Successfully!");
//       return res.status(200).json(data);
//     });
//   } catch (err) {
//     console.error("❌ Token Verification Failed:", err.message);
//     return res.status(403).json("Token is not valid!");
//   }
// };


// export const addPost = (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Not logged in!" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       return res.status(403).json({ error: "Token is not valid!" });
//     }

//     // ✅ Validate request body
//     if (!req.body.content) {
//       return res.status(400).json({ error: "Content is required!" });
//     }

//     // ✅ Prepare SQL Query and Values
//     const q = "INSERT INTO posts(`content`, `img`, `createdAt`, `userId`) VALUES (?)";
//     const values = [
//       req.body.content,
//       req.body.img || null, // ✅ Set default to null if no image
//       moment().format("YYYY-MM-DD HH:mm:ss"),
//       userInfo.id,
//     ];

//     // ✅ Insert post to DB
//     db.query(q, [values], (err, data) => {
//       if (err) {
//         console.error("❌ Database Error:", err);
//         return res.status(500).json({ error: "Failed to create post" });
//       }

//       // ✅ Return success response
//       return res.status(200).json({
//         message: "Post created successfully",
//         postId: data.insertId,
//         imgUrl: req.body.img || null, // ✅ Return uploaded image URL
//       });
//     });
//   });
// };

// // Delete Post
// export const deletePost = (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       return res.status(403).json("Token is not valid!");
//     }

//     const postId = req.params.id;
//     const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

//     db.query(q, [postId, userInfo.id], (err, data) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json("Failed to delete post");
//       }
      
//       if (data.affectedRows === 0) {
//         return res.status(403).json("You can only delete your own posts!");
//       }

//       return res.status(200).json("Post has been deleted successfully");
//     });
//   });
// };



// 📢 Import Required Libraries
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Function to Upload Image to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "social_media", // ✅ Upload to 'social_media' folder
      },
      (error, result) => {
        if (result) {
          console.log("✅ Cloudinary Upload Successful:", result.secure_url);
          resolve(result.secure_url); // ✅ Return Cloudinary URL
        } else {
          console.error("❌ Cloudinary Upload Error:", error.message);
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Get Posts (Feed or by User ID)
export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("❌ No Token Provided!");
    return res.status(401).json("Not logged in!");
  }

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified - User Info:", userInfo);

    let q;
    let values;

    if (userId) {
      // ✅ Get posts for a specific user
      q = `
        SELECT p.*, u.id AS userId, u.name, u.profilePic 
        FROM posts AS p 
        JOIN users AS u ON (p.userId = u.id)
        WHERE p.userId = ? 
        ORDER BY p.createdAt DESC
      `;
      values = [userId];
    } else {
      // ✅ Get feed posts (from user and followed users)
      q = `
        SELECT p.*, u.id AS userId, u.name, u.profilePic 
        FROM posts AS p 
        JOIN users AS u ON (p.userId = u.id)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId)
        WHERE p.userId = ? OR r.followerUserId = ?
        GROUP BY p.id
        ORDER BY p.createdAt DESC
      `;
      values = [userInfo.id, userInfo.id];
    }

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json("Database error!");
      }

      console.log("✅ Posts Fetched Successfully!");
      return res.status(200).json(data);
    });
  } catch (err) {
    console.error("❌ Token Verification Failed:", err.message);
    return res.status(403).json("Token is not valid!");
  }
};

// ✅ Add Post with Cloudinary Upload

// ✅ Add Post with Cloudinary Upload
export const addPost = async (req, res) => {
  console.log("📢 Incoming Request Body:", req.body); // ✅ Debug Incoming Data

  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not logged in!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid!" });
    }

    // ✅ Use req.body.content to get form-data content
    const content = req.body.content;

    if (!content || content.trim() === "") {
      console.error("❌ No content provided!");
      return res.status(400).json({ error: "Content is required!" });
    }

    let imgUrl = null;

    // ✅ Check if Image is Provided via Multer (req.file)
    if (req.file) {
      try {
        imgUrl = await uploadToCloudinary(req.file.buffer); // ✅ Upload to Cloudinary
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error:", uploadError.message);
        return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
      }
    }

    // ✅ Prepare SQL Query and Values
    const q = "INSERT INTO posts(`content`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      content,
      imgUrl || null, // ✅ Store Cloudinary URL in DB
      moment().format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    // ✅ Insert into Database
    console.log(q,values)
    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ error: "Failed to create post" });
      }

      console.log("✅ Post Created Successfully!");
      return res.status(200).json({
        message: "Post created successfully",
        postId: data.insertId,
        imgUrl: imgUrl || null, // ✅ Return Cloudinary URL to frontend
      });
    });
  });
};



// ✅ Delete Post
export const deletePost = (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json("Failed to delete post");
      }

      if (data.affectedRows === 0) {
        return res.status(403).json("You can only delete your own posts!");
      }

      return res.status(200).json("Post has been deleted successfully");
    });
  });
};
