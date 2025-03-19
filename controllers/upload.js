import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Upload file handler
export const uploadFile = (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  try {
    // Verify user token
    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      // Check if file exists in request
      if (!req.file) {
        return res.status(400).json("No file uploaded");
      }

      console.log("File uploaded successfully:", req.file);
      
      // Return the filename that can be stored in the database
      return res.status(200).json(req.file.filename);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json("File upload failed");
  }
};

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err) {
    console.error("Multer error:", err);
    return res.status(400).json({ error: err.message });
  }
  next();
};