import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = (req, res) => {
  try {
    // Check if file exists in request
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const file = req.files.file;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type. Only images are allowed." });
    }
    
    // Generate unique filename
    const fileName = uuidv4() + path.extname(file.name);
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../public/upload');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const uploadPath = path.join(uploadDir, fileName);
    
    // Move file to upload directory
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ error: "Failed to upload file" });
      }
      
      // Return success response with filename
      res.status(200).json(fileName);
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



