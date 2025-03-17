// // import express from "express";
// // import { getUser, updateUser } from "../controllers/user.js";

// // const router = express.Router();

// // // ✅ Get user by ID
// // router.get("/find/:userId", getUser);

// // // ✅ Update user by ID (Make sure this is defined)
// // router.put("/:userId", updateUser);

// // export default router;

// import express from "express";
// import multer from "multer";
// import { getUser, updateUser } from "../controllers/user.js";

// const router = express.Router();

// // ✅ Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/upload");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // ✅ Get user by ID
// router.get("/find/:userId", getUser);

// // ✅ Update user by ID
// router.put("/:userId", updateUser);




// // ✅ Upload profile/cover image
// router.post("/upload/:userId", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json("No file uploaded!");
//   res.status(200).json(req.file.filename); // ✅ Returns the filename for frontend usage
// });

// export default router;



import express from "express";
import multer from "multer";
import { getUser, updateUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js"; 

const router = express.Router();

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Get user by ID
router.get("/find/:userId", getUser);

// ✅ Protect update route with verifyToken
router.put("/:userId", verifyToken, updateUser);

router.get("/test", (req, res) => {
  res.send("User API is working");
});

// ✅ Upload profile/cover image
router.post("/upload/:userId", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
  res.status(200).json({ filename: req.file.filename });
});

export default router;
