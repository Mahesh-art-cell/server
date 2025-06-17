
import express from "express";
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
  getSuggestions,
  getCounts, // ✅ Import Counts API
   getFollowingIds
} from "../controllers/relationship.js";

const router = express.Router();

// ✅ Get Relationships
router.get("/", getRelationships);

// ✅ Get User Suggestions
router.get("/suggestions", getSuggestions);

// ✅ Get Followers & Following Count
router.get("/counts", getCounts); // ✅ Added counts route

// ✅ Add Relationship (Follow User)
router.post("/", addRelationship);

// ✅ Delete Relationship (Unfollow User)
router.delete("/", deleteRelationship);

router.get("/followingIds", getFollowingIds);


export default router;
