// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import cookieParser from "cookie-parser";

// const app = express();

// // ✅ Middleware Setup
// app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // ✅ CORS Setup (Ensures cookies are sent with requests)
// const whitelist = ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:3000'];
// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     if (!origin || whitelist.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error('Not allowed by CORS'));
// //     }
// //   },
// //   credentials: true, // ✅ Important: Allow cookies and credentials
// //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// //   allowedHeaders: ["Content-Type", "Authorization"],
// // };

// // app.use(cors(corsOptions));


// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // ✅ Important: Allow credentials (cookies)
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
// app.use(cors(corsOptions));



// // ✅ Debugging Middleware
// app.use((req, res, next) => {
//   console.log("📢 Incoming Request:", req.method, req.url);
//   console.log("📢 Headers:", req.headers);
//   console.log("📢 Cookies:", req.cookies);
//   console.log("📢 Body:", req.body);
//   res.header("Access-Control-Allow-Credentials", "true");
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
// import dotenv from "dotenv";
// dotenv.config();


// // ✅ API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/likes", likeRoutes);
// app.use("/api/stories", storyRoutes);
// app.use("/api/relationships", relationshipRoutes);

// app.get("/",(req,res)=>{
// res.send("root is working")
// })
// let port =process.env.PORT || 8800
// // ✅ Start Server
// app.listen(port, () => {
//   console.log("🚀 Server running on http://localhost:8800");
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

// ✅ CORS Setup
const whitelist = ["http://localhost:3001", "http://localhost:5173", "http://localhost:3000"];
const corsOptions = {
  origin: ["https://client-brown-seven.vercel.app/", "http://localhost:3000"], 
  credentials: true,  
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));


// ✅ Debugging Middleware
app.use((req, res, next) => {
  console.log("📢 Incoming Request:", req.method, req.url);
  console.log("📢 Headers:", req.headers);
  console.log("📢 Cookies:", req.cookies);
  console.log("📢 Body:", req.body);
  res.header("Access-Control-Allow-Credentials", "true");
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

app.get("/", (req, res) => {
  res.send("Root is working");
});

const port = process.env.PORT || 8800;

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
