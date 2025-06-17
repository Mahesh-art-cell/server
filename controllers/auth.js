



// import { db } from "../connect.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config(); // ✅ Load environment variables

// // ✅ Register User
// export const register = (req, res) => {
//   const q = "SELECT * FROM users WHERE username = ?";

//   db.query(q, [req.body.username], (err, data) => {
//     if (err) {
//       console.error("❌ Database Error:", err);
//       return res.status(500).json(err);
//     }

//     if (data.length) {
//       return res.status(409).json({ error: "User already exists!" });
//     }

//     // 🔐 Hash the password
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password, salt);

//     const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
//     const values = [req.body.username, req.body.email, hashedPassword, req.body.name];

//     db.query(q, [values], (err, data) => {
//       if (err) {
//         console.error("❌ Insert Error:", err);
//         return res.status(500).json(err);
//       }
//       console.log("✅ User Registered Successfully:", req.body.username);
//       res.status(200).json({ message: "User has been created successfully." });
//     });
//   });
// };




// // ✅ Login Controller
// export const login = (req, res) => {
//   const q = "SELECT * FROM users WHERE email = ?";

//   db.query(q, [req.body.email], async (err, data) => {
//     if (err) {
//       console.error("❌ Database Error:", err);
//       return res.status(500).json({ error: "Database error", details: err });
//     }

//     if (data.length === 0) {
//       console.log("❌ User not found!");
//       return res.status(404).json({ error: "User not found" });
//     }

//     // ✅ Check Password
//     const isPasswordCorrect = await bcrypt.compare(
//       req.body.password,
//       data[0].password
//     );
//     if (!isPasswordCorrect) {
//       console.log("❌ Incorrect password!");
//       return res.status(400).json({ error: "Wrong password" });
//     }

//     try {
//       // ✅ Generate JWT Token
//       const token = jwt.sign(
//         { id: data[0].id, email: data[0].email },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" } // ⏰ Token expires in 1 hour
//       );

//       if (!token) {
//         console.error("❌ Token generation failed");
//         return res.status(500).json({ error: "Failed to generate token" });
//       }

//       console.log("✅ Token Generated Successfully:", token);

//       // ✅ Set Cookie for Token
//       res.cookie("accessToken", token, {
//         httpOnly: true, // ✅ Protects against XSS attacks
//         secure: process.env.NODE_ENV === "production",
//         sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//         maxAge: 1 * 60 * 60 * 1000, // ⏰ Token valid for 1 hour
//       });

//       // ✅ Return User Data on Successful Login
//       res.status(200).json({
//         message: "Login successful",
//         token: token,
//         user: {
//           id: data[0].id,
//           username: data[0].username,
//           email: data[0].email,
//           profilePic: data[0].profilePic,
//         },
//       });
//     } catch (tokenErr) {
//       console.error("❌ Token Generation Error:", tokenErr.message);
//       return res.status(500).json({ error: "Failed to generate token" });
//     }
//   });
// };



// // ✅ Logout User
// export const logout = (req, res) => {
//   res
//     .clearCookie("accessToken", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // ✅ Match with login
//       sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ Match with login
//     })
//     .status(200)
//     .json({ message: "User has been logged out successfully." });
// };





// ✅ controllers/auth.js - MongoDB Version
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// ✅ Register User
export const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists!" });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create and save new user
    const newUser = new User({ username, email, password: hashedPassword, name });
    await newUser.save();

    console.log("✅ User Registered Successfully:", username);
    res.status(200).json({ message: "User has been created successfully." });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: "Registration failed", details: err });
  }
};

// ✅ Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 1. Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 🔍 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔐 3. Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // 🔑 4. Check for JWT secret
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT_SECRET not configured in .env" });
    }

    // 🪙 5. Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // 🍪 6. Set cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // ✅ 7. Respond with token and user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message || err);
    res.status(500).json({
      error: "Login failed",
      details: err.message || err,
    });
  }
};
// ✅ Logout User
export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    })
    .status(200)
    .json({ message: "User has been logged out successfully." });
};
