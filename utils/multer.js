import express from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// ✅ Configure Multer for File Upload
const storage = multer.diskStorage({});
export const upload = multer({ storage });

// ✅ Handle Image Upload and Send URL
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = await uploadToCloudinary(req.file.path);
    res.status(200).json({ url: fileUrl, message: '✅ File uploaded successfully!' });
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

export default router;
