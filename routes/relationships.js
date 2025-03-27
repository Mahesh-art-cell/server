
// import express from "express";
// import { getRelationships, addRelationship, deleteRelationship } from "../controllers/relationship.js";

// const router = express.Router();

// // ✅ Get Relationships
// router.get("/", getRelationships);

// // ✅ Add Relationship (Follow User)
// router.post("/", addRelationship);

// // ✅ Delete Relationship (Unfollow User)
// router.delete("/", deleteRelationship);

// export default router;



import express from "express";
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
  getSuggestions,
} from "../controllers/relationship.js";

const router = express.Router();

// ✅ Get Relationships
router.get("/", getRelationships);

// ✅ Get User Suggestions
router.get("/suggestions", getSuggestions);

// ✅ Add Relationship (Follow User)
router.post("/", addRelationship);

// ✅ Delete Relationship (Unfollow User)
router.delete("/", deleteRelationship);

export default router;
