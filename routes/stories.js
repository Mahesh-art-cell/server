// import express from "express";
// // import { getStories, addStory, deleteStory } from "../controllers/story.js";
// import { getStories, addStory, deleteStory } from "../controllers/story.js";


// const router = express.Router();

// router.get("/", getStories);
// router.post("/", addStory);
// router.delete("/:id", deleteStory);

// export default router;


import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getStories);   // ✅ Requires authentication
router.post("/", verifyToken, addStory);    // ✅ Requires authentication
router.delete("/:id", verifyToken, deleteStory);  // ✅ Requires authentication

export default router;
