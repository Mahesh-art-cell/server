
// import express from "express";
// import { getPosts, deletePost, addPost } from "../controllers/post.js";
// import { verifyToken } from "../middleware/verifyToken.js";
// import multer from "multer";

// const router = express.Router();

// // ✅ Multer Storage Configuration (In Memory)
// const storage = multer.memoryStorage(); // ✅ Temporarily store file in memory
// const upload = multer({ storage });

// // ✅ Get Posts
// router.get("/", verifyToken, getPosts);

// // ✅ Create Post with Cloudinary Upload
// router.post("/", verifyToken, upload.single("file"), addPost);

// // ✅ Delete Post
// router.delete("/:id", verifyToken, deletePost);

// export default router;



import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";

const router = express.Router();

// ✅ Multer Storage Configuration (In Memory for Cloudinary Upload)
const storage = multer.memoryStorage(); // Store file temporarily in memory
const upload = multer({ storage });

// ✅ Get All Posts (Home Feed) or User's Posts (Profile)
router.get("/", verifyToken, getPosts);

// ✅ Create Post with Image/Video Upload to Cloudinary
router.post("/", verifyToken, upload.single("file"), addPost);

// ✅ Delete Post
router.delete("/:id", verifyToken, deletePost);

export default router;
