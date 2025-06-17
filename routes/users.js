
// import express from "express";
// import { getUser, updateUser, getAllUsers} from "../controllers/user.js";
// import { verifyToken } from "../middleware/verifyToken.js";
// import multer from "multer";

// const router = express.Router();

// // ✅ Multer Storage Configuration (In Memory for Buffer Upload)
// const storage = multer.memoryStorage(); // ✅ Buffer-based Multer Storage
// const upload = multer({ storage });

// // ✅ Get User Details
// router.get("/find/:userId", getUser);

// // ✅ Update User with Profile and Cover Pic
// router.put("/:userId", verifyToken, upload.fields([
//   { name: "profilePic", maxCount: 1 },
//   { name: "coverPic", maxCount: 1 }
// ]), updateUser);

// router.get("/allUsers", getAllUsers);

// export default router;


import express from "express";
import multer from "multer";
import { getUser, updateUser, getAllUsers } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Multer storage (in-memory for buffer uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Get a single user by ID (Public)
router.get("/find/:userId", getUser);

// ✅ Update user (Private, with optional profilePic and coverPic upload)
router.put(
  "/:userId",
  verifyToken,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  updateUser
);

// ✅ Get all users (Private)
router.get("/allUsers", verifyToken, getAllUsers);

export default router;
