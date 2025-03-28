



import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

// ✅ Register User
export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json(err);
    }

    if (data.length) {
      return res.status(409).json({ error: "User already exists!" });
    }

    // 🔐 Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
    const values = [req.body.username, req.body.email, hashedPassword, req.body.name];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("❌ Insert Error:", err);
        return res.status(500).json(err);
      }
      console.log("✅ User Registered Successfully:", req.body.username);
      res.status(200).json({ message: "User has been created successfully." });
    });
  });
};




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
//     const isPasswordCorrect = await bcrypt.compare(req.body.password, data[0].password);
//     if (!isPasswordCorrect) {
//       console.log("❌ Incorrect password!");
//       return res.status(400).json({ error: "Wrong password" });
//     }

//     try {
//       // ✅ Generate JWT Token
//       console.log("🔐 Generating token with secret:", process.env.JWT_SECRET);
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
//         secure: process.env.NODE_ENV === "production", // ✅ Secure in production
//         sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ Cross-origin cookie support
//         maxAge: 1 * 60 * 60 * 1000, // ⏰ Token valid for 1 hour
//       });

//       // ✅ Return User Data on Successful Login
//       res.status(200).json({
//         message: "Login successful",
//         token: token, // ✅ Send token to client if needed
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


// ✅ Login Controller
export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], async (err, data) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (data.length === 0) {
      console.log("❌ User not found!");
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Check Password
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      data[0].password
    );
    if (!isPasswordCorrect) {
      console.log("❌ Incorrect password!");
      return res.status(400).json({ error: "Wrong password" });
    }

    try {
      // ✅ Generate JWT Token
      const token = jwt.sign(
        { id: data[0].id, email: data[0].email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // ⏰ Token expires in 1 hour
      );

      if (!token) {
        console.error("❌ Token generation failed");
        return res.status(500).json({ error: "Failed to generate token" });
      }

      console.log("✅ Token Generated Successfully:", token);

      // ✅ Set Cookie for Token
      res.cookie("accessToken", token, {
        httpOnly: true, // ✅ Protects against XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 1 * 60 * 60 * 1000, // ⏰ Token valid for 1 hour
      });

      // ✅ Return User Data on Successful Login
      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          id: data[0].id,
          username: data[0].username,
          email: data[0].email,
          profilePic: data[0].profilePic,
        },
      });
    } catch (tokenErr) {
      console.error("❌ Token Generation Error:", tokenErr.message);
      return res.status(500).json({ error: "Failed to generate token" });
    }
  });
};



// ✅ Logout User
export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Match with login
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ Match with login
    })
    .status(200)
    .json({ message: "User has been logged out successfully." });
};
