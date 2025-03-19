// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";
// import moment from "moment";


// // ✅ Get All Posts
// export const getPosts = (req, res) => {
//   console.log("✅ getPosts API hit");

//   // ✅ Retrieve token correctly from cookies or headers
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     console.log("❌ No token provided");
//     return res.status(401).json("Not logged in!");
//   }

//   try {
//     // ✅ Use the correct secret key from environment variables
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("✅ Token Verified:", userInfo);

//     const q = "SELECT * FROM posts WHERE userId = ? ORDER BY createdAt DESC"; // ✅ Sort posts by latest

//     db.query(q, [userInfo.id], (err, data) => {
//       if (err) {
//         console.log("❌ Database Error:", err);
//         return res.status(500).json("Database error!");
//       }

//       const formattedPosts = data.map((post) => ({
//         ...post,
//         createdAt: moment(post.createdAt).format("YYYY-MM-DD HH:mm:ss"),
//       }));

//       console.log("✅ Posts Retrieved:", formattedPosts);
//       res.status(200).json(formattedPosts);
//     });
//   } catch (err) {
//     console.log("❌ Token Verification Failed:", err.message);
//     return res.status(403).json("Token is not valid!");
//   }
// };




  
  

// // ✅ Add Post

// // ✅ Add Post
// export const addPost = (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     console.log("❌ No token provided");
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       console.log("❌ Token is not valid!", err.message);
//       return res.status(403).json("Token is not valid!");
//     }

//     const q = "INSERT INTO posts(`title`, `content`, `createdAt`, `userId`) VALUES (?)";
//     const values = [
//       req.body.title,
//       req.body.content,
//       moment().format("YYYY-MM-DD HH:mm:ss"), // ✅ Proper timestamp
//       userInfo.id,
//     ];

//     console.log("🟢 Insert Query Values:", values);

//     db.query(q, [values], (err, data) => {
//       if (err) {
//         console.log("❌ Database Error:", err);
//         return res.status(500).json(err);
//       }

//       console.log("✅ Post Added Successfully:", {
//         id: data.insertId,
//         ...req.body,
//         createdAt: values[2],
//         userId: userInfo.id,
//       });

//       return res.status(200).json({ message: "Post has been created." });
//     });
//   });
// };



// // ✅ Delete Post
// // ✅ Delete Post
// export const deletePost = (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     console.log("❌ No token provided");
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       console.log("❌ Token is not valid!", err.message);
//       return res.status(403).json("Token is not valid!");
//     }

//     console.log("✅ Token Verified:", userInfo);
//     const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

//     db.query(q, [req.params.id, userInfo.id], (err, data) => {
//       if (err) {
//         console.log("❌ Database Error:", err);
//         return res.status(500).json(err);
//       }
//       if (data.affectedRows > 0) {
//         console.log("✅ Post deleted successfully");
//         return res.status(200).json("Post has been deleted.");
//       }
//       console.log("❌ You can delete only your post");
//       return res.status(403).json("You can delete only your post");
//     });
//   });
// };



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

// Add Post
// export const addPost = (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json("Not logged in!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) {
//       return res.status(403).json("Token is not valid!");
//     }

//     // Validate request body
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
//         postId: data.insertId
//       });
//     });
//   });
// };




// ✅ Add New Post with Token Authentication
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

// ✅ Add New Post with Debugging
export const addPost = (req, res) => {
  // Extract token from cookies or headers
  const token =
    req.cookies?.accessToken ||
    req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json("❌ Not logged in! Token missing.");
  }

  // ✅ Verify JWT Token
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.error("❌ Invalid Token:", err);
      return res.status(403).json("Token is not valid!");
    }

    // ✅ Validate post content or image
    if (!req.body.content && !req.body.img) {
      return res.status(400).json("⚠️ Post must have content or image.");
    }

    // ✅ Prepare SQL query to insert post
    const q =
      "INSERT INTO posts(`content`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.content || "", // Content or empty
      req.body.img || null, // Image URL or null
      moment().format("YYYY-MM-DD HH:mm:ss"), // Timestamp
      userInfo.id, // Extracted from token
    ];

    // ✅ Log query before execution
    console.log("📢 Attempting to insert post with values:", values);

    // ✅ Execute query
    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("❌ Database Error:", err.sqlMessage || err);
        console.error("⚠️ Query:", q, values);
        return res.status(500).json("Failed to create post.");
      }

      // ✅ Success Response
      console.log("✅ Post inserted successfully! ID:", data.insertId);
      return res.status(200).json({
        message: "✅ Post has been created successfully!",
        postId: data.insertId,
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



