
// import mysql from "mysql2";
// import dotenv from 'dotenv';
// dotenv.config();

// // ✅ Define Connection with Production DB on Render
// export const db = mysql.createConnection({
//   host: process.env.DBHOSTNAME, // ✅ Render DB Host
//   user: process.env.DBUSER, // ✅ DB User
//   password: process.env.DBPASSWORD, // ✅ DB Password
//   database: process.env.DBNAME, // ✅ DB Name
//   port: 3306, // ✅ MySQL Port
// });

// // ✅ Connect to DB and Handle Errors
// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database Connection Error:", err.message);
//     process.exit(1);
//   }
//   console.log("✅ Database Connected Successfully!");
// });



import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
