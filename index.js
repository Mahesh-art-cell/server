


// 📢 Import Required Libraries
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./connect.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize Express App
const app = express();

// ✅ Middleware Setup
app.use(express.json());
app.use(cookieParser());

// ✅ Serve Static Files (for uploaded images)
app.use("/upload", express.static(path.resolve(process.cwd(), "public/upload")));

// ✅ Define Allowed Origins
const allowedOrigins = [
  "https://client-brown-seven.vercel.app",
  "http://localhost:3000"
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
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization","Access-Control-Allow-Credentials"],
  })
);

// ✅ Handle Preflight Requests
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
// import mediaRoutes from "./routes/media.js";

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);
// app.use("/api/media", mediaRoutes);

// ✅ Root Route for Health Check
app.get("/", (req, res) => {
  res.send("🚀 Root is working perfectly!");
});

// ✅ Start Server
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
