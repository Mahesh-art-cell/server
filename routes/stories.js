
// import express from "express";
// import { getStories, addStory, deleteStory } from "../controllers/story.js";
// import { verifyToken } from "../middleware/verifyToken.js";

// const router = express.Router();

// router.get("/", verifyToken, getStories);   // ✅ Requires authentication
// router.post("/", verifyToken, addStory);    // ✅ Requires authentication
// router.delete("/:id", verifyToken, deleteStory);  // ✅ Requires authentication

// export default router;



import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";

const router = express.Router();

// ✅ Multer Storage Configuration (In Memory)
const storage = multer.memoryStorage(); // ✅ Store file temporarily in memory
const upload = multer({ storage });

// ✅ Get Stories (Authenticated)
router.get("/", verifyToken, getStories);

// ✅ Add Story with Cloudinary Upload
router.post("/", verifyToken, upload.single("file"), addStory);

// ✅ Delete Story (Authenticated)
router.delete("/:id", verifyToken, deleteStory);

export default router;
