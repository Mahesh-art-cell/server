import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

// ✅ Get All Posts

export const getPosts = (req, res) => {
  console.log("✅ getPosts API hit");

  const token = req.cookies.accessToken;
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json("Not logged in!");
  }

  try {
    const userInfo = jwt.verify(token, "secretkey");
    console.log("✅ Token Verified:", userInfo);

    const q = "SELECT * FROM posts WHERE userId = ? ORDER BY createdAt DESC"; // ✅ Sort posts by latest

    db.query(q, [userInfo.id], (err, data) => {
      if (err) {
        console.log("❌ Database Error:", err);
        return res.status(500).json("Database error!");
      }

      const formattedPosts = data.map(post => ({
        ...post,
        createdAt: moment(post.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      }));

      console.log("✅ Posts Retrieved:", formattedPosts);
      res.status(200).json(formattedPosts);
    });

  } catch (err) {
    console.log("❌ Token Verification Failed:", err.message);
    return res.status(403).json("Token is not valid!");
  }
};



  
  

// ✅ Add Post

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("❌ Token is not valid!");
      return res.status(403).json("Token is not valid!");
    }

    const q = "INSERT INTO posts(`title`, `content`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.title,
      req.body.content,
      moment().format("YYYY-MM-DD HH:mm:ss"), // ✅ Proper timestamp
      userInfo.id,
    ];

    console.log("🟢 Insert Query Values:", values); // ✅ Debugging log

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("❌ Database Error:", err);
        return res.status(500).json(err);
      }

      console.log("✅ Post Added Successfully:", {
        id: data.insertId,
        ...req.body,
        createdAt: values[2],
        userId: userInfo.id,
      });

      return res.status(200).json({ message: "Post has been created." });
    });
  });
};



// ✅ Delete Post
export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("❌ Token is not valid!");
      return res.status(403).json("Token is not valid!");
    }

    console.log("✅ Token Verified:", userInfo);
    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) {
        console.log("❌ Database Error:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0) {
        console.log("✅ Post deleted successfully");
        return res.status(200).json("Post has been deleted.");
      }
      console.log("❌ You can delete only your post");
      return res.status(403).json("You can delete only your post");
    });
  });
};
