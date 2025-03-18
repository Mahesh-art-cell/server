

// import { db } from "../connect.js";

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
//   if (req.userInfo.id != req.params.userId) {
//     console.error("❌ Unauthorized update attempt");
//     return res.status(403).json("You can update only your own profile!");
//   }

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
  
//   if (req.body.coverPic !== undefined) {
//     updateFields.push("`coverPic`=?");
//     values.push(req.body.coverPic);
//   }
  
//   if (req.body.profilePic !== undefined) {
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
  
//   // Add the user ID as the last value
//   values.push(req.params.userId);
  
//   // Construct the final query
//   const q = `UPDATE users SET ${updateFields.join(", ")} WHERE id=?`;
  
//   console.log("🔹 Final SQL query:", q);
//   console.log("🔹 Values:", values);

//   db.query(q, values, (err, data) => {
//     if (err) {
//       console.error("❌ Error updating user:", err);
//       return res.status(500).json(err);
//     }
    
//     if (data.affectedRows === 0) {
//       console.error("❌ No rows affected");
//       return res.status(404).json("User not found or no changes made");
//     }
    
//     console.log("✅ User updated successfully!");
//     return res.status(200).json("User updated successfully!");
//   });
// };



import { db } from "../connect.js";
import fs from "fs";
import path from "path";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) return res.status(404).json("User not found!");

    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  console.log("🔹 Updating user:", req.params.userId);
  console.log("🔹 Request body:", req.body);

  // Check if user is authorized to update this profile
  if (parseInt(req.userInfo.id) !== parseInt(req.params.userId)) {
    console.error("❌ Unauthorized update attempt");
    return res.status(403).json("You can update only your own profile!");
  }

  // First get the current user data to check for old images that need to be deleted
  const getCurrentUserData = () => {
    return new Promise((resolve, reject) => {
      const q = "SELECT coverPic, profilePic FROM users WHERE id = ?";
      db.query(q, [req.params.userId], (err, data) => {
        if (err) return reject(err);
        if (data.length === 0) return reject("User not found");
        resolve(data[0]);
      });
    });
  };

  // Delete old image file if it exists and is being replaced
  const deleteOldImage = (filename) => {
    if (!filename) return;
    
    // Don't delete default images or external URLs
    if (filename.startsWith('http') || filename === 'default-avatar.png' || filename === 'default-cover.png') {
      return;
    }
    
    const filePath = path.join("public/upload", filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted old image: ${filename}`);
      } catch (err) {
        console.error(`❌ Error deleting old image ${filename}:`, err);
      }
    }
  };

  // Build the query dynamically based on provided fields
  const updateFields = [];
  const values = [];
  
  // Check each field and add to the query if present
  if (req.body.name !== undefined) {
    updateFields.push("`name`=?");
    values.push(req.body.name);
  }
  
  if (req.body.email !== undefined) {
    updateFields.push("`email`=?");
    values.push(req.body.email);
  }
  
  if (req.body.username !== undefined) {
    updateFields.push("`username`=?");
    values.push(req.body.username);
  }
  
  // We'll handle these specially for file cleanup
  const hasCoverUpdate = req.body.coverPic !== undefined;
  const hasProfileUpdate = req.body.profilePic !== undefined;
  
  if (hasCoverUpdate) {
    updateFields.push("`coverPic`=?");
    values.push(req.body.coverPic);
  }
  
  if (hasProfileUpdate) {
    updateFields.push("`profilePic`=?");
    values.push(req.body.profilePic);
  }
  
  if (req.body.city !== undefined) {
    updateFields.push("`city`=?");
    values.push(req.body.city);
  }
  
  if (req.body.website !== undefined) {
    updateFields.push("`website`=?");
    values.push(req.body.website);
  }
  
  // If no fields to update, return early
  if (updateFields.length === 0) {
    return res.status(400).json("No fields to update!");
  }
  
  // Perform the update with file cleanup
  getCurrentUserData()
    .then(userData => {
      // Add the user ID as the last value
      values.push(req.params.userId);
      
      // Construct the final query
      const q = `UPDATE users SET ${updateFields.join(", ")} WHERE id=?`;
      
      console.log("🔹 Final SQL query:", q);
      console.log("🔹 Values:", values);
      
      db.query(q, values, (err, data) => {
        if (err) {
          console.error("❌ Error updating user:", err);
          return res.status(500).json(err);
        }
        
        if (data.affectedRows === 0) {
          console.error("❌ No rows affected");
          return res.status(404).json("User not found or no changes made");
        }
        
        // Clean up old images if they were replaced
        if (hasCoverUpdate && userData.coverPic) {
          deleteOldImage(userData.coverPic);
        }
        
        if (hasProfileUpdate && userData.profilePic) {
          deleteOldImage(userData.profilePic);
        }
        
        console.log("✅ User updated successfully!");
        return res.status(200).json("User updated successfully!");
      });
    })
    .catch(err => {
      console.error("❌ Error getting current user data:", err);
      return res.status(500).json("Error updating user profile");
    });
};