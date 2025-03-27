// import express from "express";
// import { getRelationships, addRelationship, deleteRelationship } from "../controllers/relationship.js";

// const router = express.Router()

// router.get("/", getRelationships)
// router.post("/", addRelationship)
// router.delete("/", deleteRelationship)


// export default router


import express from "express";
import { getRelationships, addRelationship, deleteRelationship } from "../controllers/relationship.js";

const router = express.Router();

// ✅ Get Relationships
router.get("/", getRelationships);

// ✅ Add Relationship (Follow User)
router.post("/", addRelationship);

// ✅ Delete Relationship (Unfollow User)
router.delete("/", deleteRelationship);

export default router;
