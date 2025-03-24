
// import express from "express";
// import { getPosts, addPost, deletePost } from "../controllers/post.js";
// import { verifyToken } from "../middleware/verifyToken.js";  // Import middleware

// const router = express.Router();

// router.get("/", verifyToken, getPosts);   // ✅ Requires authentication
// router.post("/", verifyToken, addPost);   // ✅ Requires authentication
// router.delete("/:id", verifyToken, deletePost); // ✅ Requires authentication

// export default router;






import express from "express";
import { getPosts, deletePost, addPost } from "../controllers/post.js";
import { verifyToken } from "../middleware/verifyToken.js"; // ✅ Corrected Import

const router = express.Router();

// ✅ Get Posts (Home or Profile)
router.get("/", verifyToken, getPosts);

// ✅ Create Post
router.post("/", verifyToken, addPost);

// ✅ Delete Post
router.delete("/:id", verifyToken, deletePost);

export default router;
