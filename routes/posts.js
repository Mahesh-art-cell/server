
// import express from "express";
// import { getPosts, addPost, deletePost } from "../controllers/post.js";
// import { verifyToken } from "../middleware/verifyToken.js";  // Import middleware

// const router = express.Router();

// router.get("/", verifyToken, getPosts);   // ✅ Requires authentication
// router.post("/", verifyToken, addPost);   // ✅ Requires authentication
// router.delete("/:id", verifyToken, deletePost); // ✅ Requires authentication

// export default router;






// import express from "express";
// import { getPosts, deletePost, addPost } from "../controllers/post.js";
// // import { verifyToken } from "../middleware/auth.js";
// import {verifyToken} from "../middleware/verifyToken.js"

// const router = express.Router();

// // ✅ Get Posts (Home or Profile)
// router.get("/", verifyToken, getPosts);

// // ✅ Create Post
// router.post("/", verifyToken, addPost);

// // ✅ Delete Post
// router.delete("/:id", verifyToken, deletePost);

// export default router;



import express from "express";
import { db } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Create New Post
router.post("/", verifyToken, async (req, res) => {
  const { content, img } = req.body;
  const userId = req.userInfo.id;

  console.log("📢 Creating Post - User ID:", userId);
  console.log("📸 Cloudinary URL:", img);

  const q =
    "INSERT INTO posts (`content`, `img`, `userId`, `createdAt`) VALUES (?, ?, ?, NOW())";

  try {
    const result = await db.query(q, [content, img, userId]);
    console.log("✅ Post Created Successfully:", result);
    res.status(200).json({ message: "Post created successfully!" });
  } catch (error) {
    console.error("❌ Error Creating Post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
});

// ✅ Get All Posts
router.get("/", verifyToken, async (req, res) => {
  const q = "SELECT * FROM posts ORDER BY createdAt DESC";

  try {
    const [posts] = await db.query(q);
    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error Fetching Posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts." });
  }
});

export default router;
