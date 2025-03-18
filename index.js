


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

// ✅ Allowed Origins
const whitelist = [
  "http://localhost:3001", // ✅ Local Dev
  // "https://client-brown-seven.vercel.app", // ✅ Production URL
];

// ✅ Configure CORS
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
    credentials: true, // ✅ Allow cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204, // ✅ Send 204 for preflight success
  })
);

// ✅ Handle Preflight (OPTIONS) Requests Manually
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

// ✅ Debugging Middleware for Origin Check
app.use((req, res, next) => {
  console.log("📢 Incoming Request from:", req.headers.origin || "Unknown");
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
