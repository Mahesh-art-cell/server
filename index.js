
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// // ✅ Middleware Setup
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Serve Static Files (for uploaded images)
// app.use("/upload", express.static("public/upload"));

// // ✅ Allowed Origins
// const whitelist = [
//   "http://localhost:3000", // ✅ Local Development
//   "https://client-brown-seven.vercel.app", // ✅ Deployed Client
// ];

// // ✅ CORS Configuration
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || whitelist.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.log("❌ Blocked by CORS - Origin:", origin);
//         callback(new Error("❌ Not allowed by CORS"));
//       }
//     },
//     credentials: true, // ✅ Allow Cookies
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     optionsSuccessStatus: 204,
//   })
// );

// // ✅ Import Routes
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/users.js";
// import postRoutes from "./routes/posts.js";
// import commentRoutes from "./routes/comments.js";
// import likeRoutes from "./routes/likes.js";
// import storyRoutes from "./routes/stories.js";
// import relationshipRoutes from "./routes/relationships.js";

// // ✅ API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/likes", likeRoutes);
// app.use("/api/stories", storyRoutes);
// app.use("/api/relationships", relationshipRoutes);

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("Root is working 🚀");
// });

// // ✅ Start Server
// const port = process.env.PORT || 8800;
// app.listen(port, () => {
//   console.log(`🚀 Server running on http://localhost:${port}`);
// });




  // import express from "express";
  // import cors from "cors";
  // import cookieParser from "cookie-parser";
  // import dotenv from "dotenv";

  // dotenv.config(); // ✅ Load .env variables

  // const app = express();

  // // ✅ Middleware Setup
  // app.use(express.json());
  // app.use(cookieParser());

  // // ✅ Serve Static Files (for uploaded images)
  // app.use("/upload", express.static("public/upload"));

  // // ✅ Allowed Origins
  // const whitelist = [
  //   "http://localhost:3000", // ✅ Local Development
  //   "https://client-brown-seven.vercel.app", // ✅ Deployed Client
  // ];

  // // ✅ CORS Configuration
  // app.use(
  //   cors({
  //     origin: (origin, callback) => {
  //       if (!origin || whitelist.includes(origin)) {
  //         callback(null, true);
  //       } else {
  //         console.log("❌ Blocked by CORS - Origin:", origin);
  //         callback(new Error("❌ Not allowed by CORS"));
  //       }
  //     },
  //     credentials: true, // ✅ Allow Cookies
  //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //     allowedHeaders: ["Content-Type", "Authorization"],
  //     optionsSuccessStatus: 204,
  //   })
  // );

  // // ✅ Import Routes
  // import authRoutes from "./routes/auth.js";
  // import userRoutes from "./routes/users.js";
  // import postRoutes from "./routes/posts.js";
  // import commentRoutes from "./routes/comments.js";
  // import likeRoutes from "./routes/likes.js";
  // import storyRoutes from "./routes/stories.js";
  // import relationshipRoutes from "./routes/relationships.js";

  // // ✅ API Routes
  // app.use("/api/auth", authRoutes);
  // app.use("/api/users", userRoutes);
  // app.use("/api/posts", postRoutes);
  // app.use("/api/comments", commentRoutes);
  // app.use("/api/likes", likeRoutes);
  // app.use("/api/stories", storyRoutes);
  // app.use("/api/relationships", relationshipRoutes);

  // // ✅ Test Route
  // app.get("/", (req, res) => {
  //   res.send("Root is working 🚀");
  // });

  // // ✅ Start Server
  // const port = process.env.PORT || 8800;
  // app.listen(port, () => {
  //   console.log(`🚀 Server running on http://localhost:${port}`);
  // });


  import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // ✅ Load .env variables

const app = express();

// ✅ Middleware Setup
app.use(express.json());
app.use(cookieParser());

// ✅ File Upload Middleware
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true
}));

// ✅ Serve Static Files (for uploaded images)
app.use("/upload", express.static(path.join(__dirname, "public/upload")));

// ✅ Allowed Origins
const whitelist = [
  "http://localhost:3000", // ✅ Local Development
  "https://client-brown-seven.vercel.app", // ✅ Deployed Client
];

// ✅ CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS - Origin:", origin);
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow Cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// ✅ Import Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import storyRoutes from "./routes/stories.js";
import relationshipRoutes from "./routes/relationships.js";
import uploadRoutes from "./routes/upload.js"; // Added upload routes


// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/upload", uploadRoutes); // Added upload route

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    status: "error",
    message: err.message || "Something went wrong!"
  });
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Root is working 🚀");
});

// ✅ Start Server
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
