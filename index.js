
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
// import uploadRoutes from "./routes/upload.js"; // ✅ Import Upload Route

// // ✅ API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/likes", likeRoutes);
// app.use("/api/stories", storyRoutes);
// app.use("/api/relationships", relationshipRoutes);
// app.use("/upload", uploadRoutes); // ✅ Add Upload API Route

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("Root is working 🚀");
// });

// // ✅ Start Server
// const port = process.env.PORT || 8800;
// app.listen(port, () => {
//   console.log(`🚀 Server running on http://localhost:${port}`);
// });



// 📢 Import Required Libraries
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

dotenv.config(); // ✅ Load environment variables

const app = express();

// ✅ Middleware Setup
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies

// ✅ Serve Static Files (for uploaded images)
app.use("/upload", express.static(path.resolve(process.cwd(), "public/upload")));

// ✅ Define Allowed Origins
const allowedOrigins = [
  "http://localhost:3000", // ✅ Local Development
  "https://client-brown-seven.vercel.app", // ✅ Deployed Frontend URL
];

// ✅ CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Blocked by CORS - Origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow Cookies and Tokens
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle Preflight Requests Correctly (Fix Preflight Issues)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-access-token"
  );
  res.status(204).end();
});

// ✅ Import Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import storyRoutes from "./routes/stories.js";
import relationshipRoutes from "./routes/relationships.js";
// import uploadRoutes from "./routes/upload.js";
import mediaRoutes from "./routes/media.js";

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);
// app.use("/api/upload", uploadRoutes);
app.use("/api/media", mediaRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 Root is working perfectly!");
});

// ✅ Start Server
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
