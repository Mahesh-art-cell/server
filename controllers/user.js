
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
//     } else {
//       console.log(`⚠️ File not found for deletion: ${filePath}`);
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
  
//   // Social media links
//   if (req.body.facebook !== undefined) {
//     updateFields.push("`facebook`=?");
//     values.push(req.body.facebook);
//   }
  
//   if (req.body.instagram !== undefined) {
//     updateFields.push("`instagram`=?");
//     values.push(req.body.instagram);
//   }
  
//   if (req.body.twitter !== undefined) {
//     updateFields.push("`twitter`=?");
//     values.push(req.body.twitter);
//   }
  
//   if (req.body.linkedin !== undefined) {
//     updateFields.push("`linkedin`=?");
//     values.push(req.body.linkedin);
//   }
  
//   if (req.body.pinterest !== undefined) {
//     updateFields.push("`pinterest`=?");
//     values.push(req.body.pinterest);
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
//         if (hasCoverUpdate && userData.coverPic && userData.coverPic !== req.body.coverPic) {
//           deleteOldImage(userData.coverPic);
//         }
        
//         if (hasProfileUpdate && userData.profilePic && userData.profilePic !== req.body.profilePic) {
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



// 📢 Import Required Libraries
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import moment from "moment";
import streamifier from "streamifier";

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload Buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder, // ✅ Upload to the provided folder
      },
      (error, result) => {
        if (result) {
          console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
          resolve(result.secure_url);
        } else {
          console.error(`❌ Cloudinary Upload Error:`, error.message);
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Delete Image from Cloudinary
const deleteFromCloudinary = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith("http")) return;

  const parts = imageUrl.split("/");
  const publicIdWithExtension = parts[parts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];

  return cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      console.error(`❌ Error deleting image from Cloudinary:`, error.message);
    } else {
      console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
    }
  });
};

// ✅ Get User Details
export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT id, username, email, name, created_at, profilePic, coverPic FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    return res.json(data[0]);
  });
};

// ✅ Update User with Profile and Cover Pic (Cloudinary Upload via Buffer)
export const updateUser = async (req, res) => {
  const userId = req.params.userId;

  // ✅ Check Authorization
  if (parseInt(req.userInfo.id) !== parseInt(userId)) {
    return res.status(403).json("You can update only your own profile!");
  }

  // ✅ Get Current User Data
  const getUserData = () => {
    return new Promise((resolve, reject) => {
      const q = "SELECT profilePic, coverPic FROM users WHERE id = ?";
      db.query(q, [userId], (err, data) => {
        if (err) return reject(err);
        if (data.length === 0) return reject("User not found!");
        resolve(data[0]);
      });
    });
  };

  try {
    const existingUser = await getUserData();

    // ✅ Upload Profile Pic if provided
    let profilePicUrl = existingUser.profilePic;
    if (req.files?.profilePic) {
      if (existingUser.profilePic) {
        await deleteFromCloudinary(existingUser.profilePic);
      }
      profilePicUrl = await uploadToCloudinary(req.files.profilePic[0].buffer, "profile_pics");
    }

    // ✅ Upload Cover Pic if provided
    let coverPicUrl = existingUser.coverPic;
    if (req.files?.coverPic) {
      if (existingUser.coverPic) {
        await deleteFromCloudinary(existingUser.coverPic);
      }
      coverPicUrl = await uploadToCloudinary(req.files.coverPic[0].buffer, "cover_pics");
    }

    // ✅ Update User Data in MySQL
    const q = `
      UPDATE users
      SET name = ?, email = ?, username = ?, profilePic = ?, coverPic = ?
      WHERE id = ?
    `;

    const values = [
      req.body.name || existingUser.name,
      req.body.email || existingUser.email,
      req.body.username || existingUser.username,
      profilePicUrl,
      coverPicUrl,
      userId,
    ];

    db.query(q, values, (err, result) => {
      if (err) {
        console.error("❌ Error updating user:", err);
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json("User not found or no changes made.");
      }

      console.log("✅ User updated successfully!");
      console.log(`🌐 New Profile Pic URL: ${profilePicUrl}`);
      console.log(`🌐 New Cover Pic URL: ${coverPicUrl}`);

      // ✅ Return Updated URLs to Frontend
      return res.status(200).json({
        message: "User updated successfully!",
        profilePic: profilePicUrl,
        coverPic: coverPicUrl,
      });
    });
  } catch (error) {
    console.error("❌ Error updating user:", error.message);
    return res.status(500).json("Error updating user profile.");
  }
};
