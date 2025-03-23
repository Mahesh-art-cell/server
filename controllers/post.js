

import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

// Get Posts (feed or by userId)
export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    
    let q;
    let values;

    if (userId) {
      // Get posts for a specific user
      q = `
        SELECT p.*, u.id AS userId, u.name, u.profilePic 
        FROM posts AS p 
        JOIN users AS u ON (p.userId = u.id)
        WHERE p.userId = ? 
        ORDER BY p.createdAt DESC
      `;
      values = [userId];
    } else {
      // Get feed posts (from user and followed users)
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
        console.error("Database Error:", err);
        return res.status(500).json("Database error!");
      }

      return res.status(200).json(data);
    });
  } catch (err) {
    console.error("Token Verification Failed:", err.message);
    return res.status(403).json("Token is not valid!");
  }
};



// ✅ Add New Post with Token Authentication
// ✅ Add New Post with Debugging
// export const addPost = (req, res) => {
//   // Get token from cookies or authorization header
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   // ✅ Check if token is missing
//   if (!token) {
//     return res.status(401).json({ error: "Not logged in!" });
//   }

//   // ✅ Verify token
//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       return res.status(403).json({ error: "Token is not valid!" });
//     }

//     // ✅ Validate request body (title and content are required)
//     if (!req.body.title || !req.body.content) {
//       return res.status(400).json({ error: "Title and content are required!" });
//     }

//     // ✅ Prepare SQL Query and Values
//     const q = "INSERT INTO posts(`title`, `content`, `img`, `createdAt`, `userId`) VALUES (?)";
//     const values = [
//       req.body.title,
//       req.body.content,
//       req.body.img || null, // Optional image URL
//       moment().format("YYYY-MM-DD HH:mm:ss"),
//       userInfo.id,
//     ];

//     // ✅ Execute the Query
//     db.query(q, [values], (err, data) => {
//       if (err) {
//         console.error("❌ Database Error:", err);
//         return res.status(500).json({ error: "Failed to create post" });
//       }

//       // ✅ Return success response
//       return res.status(200).json({
//         message: "Post has been created successfully",
//         postId: data.insertId,
//       });
//     });
//   });
// };

export const addPost = (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not logged in!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid!" });
    }

    // ✅ Validate request body
    if (!req.body.content) {
      return res.status(400).json({ error: "Content is required!" });
    }

    // ✅ Prepare SQL Query and Values
    const q = "INSERT INTO posts(`content`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.content,
      req.body.img || null, // ✅ Set default to null if no image
      moment().format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    // ✅ Insert post to DB
    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ error: "Failed to create post" });
      }

      // ✅ Return success response
      return res.status(200).json({
        message: "Post created successfully",
        postId: data.insertId,
        imgUrl: req.body.img || null, // ✅ Return uploaded image URL
      });
    });
  });
};

// Delete Post
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
        console.error("Database Error:", err);
        return res.status(500).json("Failed to delete post");
      }
      
      if (data.affectedRows === 0) {
        return res.status(403).json("You can only delete your own posts!");
      }

      return res.status(200).json("Post has been deleted successfully");
    });
  });
};






// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";
// import moment from "moment";

// // ✅ Get Posts (Feed or by userId)
// export const getPosts = (req, res) => {
//   const userId = req.query.userId;
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json("Not logged in!");
//   }

//   try {
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);
//     let q;
//     let values;

//     if (userId) {
//       // Get posts for a specific user
//       q = `
//         SELECT p.*, u.id AS userId, u.name, u.profilePic 
//         FROM posts AS p 
//         JOIN users AS u ON (p.userId = u.id)
//         WHERE p.userId = ? 
//         ORDER BY p.createdAt DESC
//       `;
//       values = [userId];
//     } else {
//       // Get feed posts (from user and followed users)
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

//     db.query(q, values, (err, data) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json("Database error!");
//       }
//       return res.status(200).json(data);
//     });
//   } catch (err) {
//     console.error("Token Verification Failed:", err.message);
//     return res.status(403).json("Token is not valid!");
//   }
// };

// // ✅ Add Post
// export const addPost = (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       return res.status(403).json("Token is not valid!");
//     }

//     if (!req.body.content && !req.body.img) {
//       return res.status(400).json("Post must have content or image");
//     }

//     const q = "INSERT INTO posts(`content`, `img`, `createdAt`, `userId`) VALUES (?)";
//     const values = [
//       req.body.content || "",
//       req.body.img || null,
//       moment().format("YYYY-MM-DD HH:mm:ss"),
//       userInfo.id,
//     ];

//     db.query(q, [values], (err, data) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json("Failed to create post");
//       }

//       return res.status(200).json({
//         message: "Post has been created successfully",
//         postId: data.insertId,
//       });
//     });
//   });
// };


// // ✅ Add Post Controller
// // export const addPost = (req, res) => {
// //   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

// //   if (!token) {
// //     return res.status(401).json("Not logged in!");
// //   }

// //   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
// //     if (err) {
// //       return res.status(403).json("Token is not valid!");
// //     }

// //     if (!req.body.content && !req.body.img) {
// //       return res.status(400).json("Post must have content or image.");
// //     }

// //     const q = "INSERT INTO posts(`content`, `img`, `createdAt`, `userId`) VALUES (?)";
// //     const values = [
// //       req.body.content || "",
// //       req.body.img || null,
// //       moment().format("YYYY-MM-DD HH:mm:ss"),
// //       userInfo.id,
// //     ];

// //     db.query(q, [values], (err, data) => {
// //       if (err) {
// //         console.error("❌ Database Error:", err);
// //         return res.status(500).json("Failed to create post");
// //       }

// //       return res.status(200).json({
// //         message: "✅ Post created successfully!",
// //         postId: data.insertId,
// //       });
// //     });
// //   });
// // };


// // ✅ Delete Post
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


