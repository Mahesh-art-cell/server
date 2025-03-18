
// import { db } from "../connect.js";
// import fs from "fs";
// import path from "path";

// export const getUser = (req, res) => {
//   const userId = req.params.userId;
//   const q = "SELECT * FROM users WHERE id=?";

//   db.query(q, [userId], (err, data) => {
//     if (err) return res.status(500).json(err);

//     if (data.length === 0) return res.status(404).json("User not found!");

//     const { password, ...info } = data[0];
//     return res.json(info);
//   });
// };

// export const updateUser = (req, res) => {
//   console.log("🔹 Updating user:", req.params.userId);
//   console.log("🔹 Request body:", req.body);

//   // Check if user is authorized to update this profile
//   if (parseInt(req.userInfo.id) !== parseInt(req.params.userId)) {
//     console.error("❌ Unauthorized update attempt");
//     return res.status(403).json("You can update only your own profile!");
//   }

//   // First get the current user data to check for old images that need to be deleted
//   const getCurrentUserData = () => {
//     return new Promise((resolve, reject) => {
//       const q = "SELECT coverPic, profilePic FROM users WHERE id = ?";
//       db.query(q, [req.params.userId], (err, data) => {
//         if (err) return reject(err);
//         if (data.length === 0) return reject("User not found");
//         resolve(data[0]);
//       });
//     });
//   };

//   // Delete old image file if it exists and is being replaced
//   const deleteOldImage = (filename) => {
//     if (!filename) return;
    
//     // Don't delete default images or external URLs
//     if (filename.startsWith('http') || filename === 'default-avatar.png' || filename === 'default-cover.png') {
//       return;
//     }
    
//     const filePath = path.join("public/upload", filename);
//     if (fs.existsSync(filePath)) {
//       try {
//         fs.unlinkSync(filePath);
//         console.log(`🗑️ Deleted old image: ${filename}`);
//       } catch (err) {
//         console.error(`❌ Error deleting old image ${filename}:`, err);
//       }
//     }
//   };

//   // Build the query dynamically based on provided fields
//   const updateFields = [];
//   const values = [];
  
//   // Check each field and add to the query if present
//   if (req.body.name !== undefined) {
//     updateFields.push("`name`=?");
//     values.push(req.body.name);
//   }
  
//   if (req.body.email !== undefined) {
//     updateFields.push("`email`=?");
//     values.push(req.body.email);
//   }
  
//   if (req.body.username !== undefined) {
//     updateFields.push("`username`=?");
//     values.push(req.body.username);
//   }
  
//   // We'll handle these specially for file cleanup
//   const hasCoverUpdate = req.body.coverPic !== undefined;
//   const hasProfileUpdate = req.body.profilePic !== undefined;
  
//   if (hasCoverUpdate) {
//     updateFields.push("`coverPic`=?");
//     values.push(req.body.coverPic);
//   }
  
//   if (hasProfileUpdate) {
//     updateFields.push("`profilePic`=?");
//     values.push(req.body.profilePic);
//   }
  
//   if (req.body.city !== undefined) {
//     updateFields.push("`city`=?");
//     values.push(req.body.city);
//   }
  
//   if (req.body.website !== undefined) {
//     updateFields.push("`website`=?");
//     values.push(req.body.website);
//   }
  
//   // If no fields to update, return early
//   if (updateFields.length === 0) {
//     return res.status(400).json("No fields to update!");
//   }
  
//   // Perform the update with file cleanup
//   getCurrentUserData()
//     .then(userData => {
//       // Add the user ID as the last value
//       values.push(req.params.userId);
      
//       // Construct the final query
//       const q = `UPDATE users SET ${updateFields.join(", ")} WHERE id=?`;
      
//       console.log("🔹 Final SQL query:", q);
//       console.log("🔹 Values:", values);
      
//       db.query(q, values, (err, data) => {
//         if (err) {
//           console.error("❌ Error updating user:", err);
//           return res.status(500).json(err);
//         }
        
//         if (data.affectedRows === 0) {
//           console.error("❌ No rows affected");
//           return res.status(404).json("User not found or no changes made");
//         }
        
//         // Clean up old images if they were replaced
//         if (hasCoverUpdate && userData.coverPic) {
//           deleteOldImage(userData.coverPic);
//         }
        
//         if (hasProfileUpdate && userData.profilePic) {
//           deleteOldImage(userData.profilePic);
//         }
        
//         console.log("✅ User updated successfully!");
//         return res.status(200).json("User updated successfully!");
//       });
//     })
//     .catch(err => {
//       console.error("❌ Error getting current user data:", err);
//       return res.status(500).json("Error updating user profile");
//     });
// };



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

// ✅ Login User
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
    const isPasswordCorrect = await bcrypt.compare(req.body.password, data[0].password);
    if (!isPasswordCorrect) {
      console.log("❌ Incorrect password!");
      return res.status(400).json({ error: "Wrong password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: data[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // ⏰ Token expires in 1 hour
    );

    console.log("✅ Token Generated Successfully:", token);

    // ✅ Set Cookie for Token
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Secure in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ Cross-origin cookies
      maxAge: 1 * 60 * 60 * 1000, // ⏰ Token valid for 1 hour
    });

    // ✅ Return User Data on Successful Login
    res.status(200).json({
      message: "Login successful",
      user: {
        id: data[0].id,
        username: data[0].username,
        email: data[0].email,
        profilePic: data[0].profilePic,
      },
    });
  });
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
