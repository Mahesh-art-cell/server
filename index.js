


// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// // ✅ Middleware Setup
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Allow Multiple Origins Dynamically
// const whitelist = [
//   "http://localhost:3000", // ✅ Local Dev
//   "https://client-brown-seven.vercel.app", // ✅ Production URL
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || whitelist.includes(origin)) {
//       callback(null, true); // ✅ Allow Origin
//     } else {
//       callback(new Error("❌ Not allowed by CORS")); // ❌ Block Other Origins
//     }
//   },
//   credentials: true,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

// // ✅ Debugging Middleware to Log Origin
// app.use((req, res, next) => {
//   console.log("📢 Incoming request from:", req.headers.origin);
//   next();
// });

// // ✅ Handle Preflight Requests Manually
// app.options("*", cors(corsOptions));

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

// dotenv.config();

// const app = express();

// // ✅ Middleware Setup
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Allow Multiple Origins Dynamically
// const whitelist = [
//   "http://localhost:3000", // ✅ Local Dev
//   "https://client-brown-seven.vercel.app", // ✅ Production URL
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || whitelist.includes(origin)) {
//       callback(null, true); // ✅ Allow Origin
//     } else {
//       callback(new Error("❌ Not allowed by CORS")); // ❌ Block Other Origins
//     }
//   },
//   credentials: true, // ✅ Allows Cookies
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

// // ✅ Handle Preflight Requests
// app.options("*", cors(corsOptions));

// // ✅ Debugging Middleware to Log Origin
// app.use((req, res, next) => {
//   console.log("📢 Incoming request from:", req.headers.origin);
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

// ✅ Allow Multiple Origins Dynamically
const whitelist = [
  "http://localhost:3000", // ✅ Local Dev
  "https://client-brown-seven.vercel.app", // ✅ Production URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true); // ✅ Allow Origin
    } else {
      callback(new Error("❌ Not allowed by CORS")); // ❌ Block Other Origins
    }
  },
  credentials: true, // ✅ Allows Cookies to be sent
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false, // ✅ Important for OPTIONS requests
  optionsSuccessStatus: 204, // ✅ Handle preflight properly
};

app.use(cors(corsOptions));

// ✅ Handle Preflight (OPTIONS) Requests Globally
app.options("*", cors(corsOptions));

// ✅ Debugging Middleware to Log Origin
app.use((req, res, next) => {
  console.log("📢 Incoming request from:", req.headers.origin || "Unknown");
  next();
});

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
