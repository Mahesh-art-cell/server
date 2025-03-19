
// import express from "express";
// import { getPosts, addPost, deletePost } from "../controllers/post.js";
// import { verifyToken } from "../middleware/verifyToken.js";  // Import middleware

// const router = express.Router();

// router.get("/", verifyToken, getPosts);   // ✅ Requires authentication
// router.post("/", verifyToken, addPost);   // ✅ Requires authentication
// router.delete("/:id", verifyToken, deletePost); // ✅ Requires authentication

// export default router;



// import express from "express";
// import { getPosts, addPost, deletePost } from "../controllers/post.js";
// import { verifyToken } from "../middleware/verifyToken.js";

// const router = express.Router();

// // Get posts (feed or specific user)
// router.get("/", verifyToken, getPosts);

// // Create new post
// router.post("/", verifyToken, addPost);

// // Delete post
// router.delete("/:id", verifyToken, deletePost);

// export default router;



import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post.js";

const router = express.Router();

// ✅ Get posts (home feed or specific user)
router.get("/", getPosts);

// ✅ Create new post
router.post("/", addPost);

// ✅ Delete post
router.delete("/:id", deletePost);

export default router;
