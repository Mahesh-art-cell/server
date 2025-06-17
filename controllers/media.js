// import { db } from "../connect.js";

// // ✅ Get All Media (Images & Videos)
// export const getMedia = (req, res) => {
//   const q = "SELECT * FROM media ORDER BY created_at DESC";

//   db.query(q, (err, data) => {
//     if (err) {
//       console.error("❌ Database Error:", err);
//       return res.status(500).json({ error: "Failed to fetch media" });
//     }
//     res.status(200).json(data);
//   });
// };

// // ✅ Add Media to DB after Cloudinary Upload
// export const addMedia = (url, type) => {
//   const q = "INSERT INTO media (`url`, `type`, `created_at`) VALUES (?)";
//   const values = [url, type, new Date()];

//   db.query(q, [values], (err, data) => {
//     if (err) {
//       console.error("❌ Database Error:", err);
//     } else {
//       console.log("✅ Media added successfully with ID:", data.insertId);
//     }
//   });
// };
