

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// // ✅ Middleware Setup
// app.use(express.json());
// app.use(cookieParser());

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
//     credentials: true, // ✅ Important for cookies
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     optionsSuccessStatus: 204,
//   })
// );

// // ✅ Handle Preflight Request
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,PUT,PATCH,POST,DELETE,OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(204);
// });

// // ✅ Debug CORS Requests
// app.use((req, res, next) => {
//   console.log("📢 Incoming Request from:", req.headers.origin || "Unknown");
//   next();
// });


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

dotenv.config();

const app = express();

// ✅ Middleware Setup
app.use(express.json());
app.use(cookieParser());

// ✅ Serve Static Files (for uploaded images)
app.use("/upload", express.static("public/upload"));

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

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Root is working 🚀");
});

// ✅ Start Server
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
