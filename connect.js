


// import mysql from "mysql2";
// import dotenv from "dotenv";
// dotenv.config(); // ✅ Load environment variables

// // ✅ Create Database Pool
// export const db = mysql.createPool({
//   host: process.env.DBHOSTNAME,
//   user: process.env.DBUSER,
//   password: process.env.DBPASSWORD,
//   database: process.env.DBNAME,
//   port: 3306, // ✅ Explicitly define port for MySQL
//   waitForConnections: true, // ✅ Maintain connection pool
//   connectionLimit: 10, // ✅ Allow 10 concurrent connections
//   queueLimit: 0, // ✅ Unlimited queue (optional, but safe for now)
// });

// // ✅ Check Database Connection
// db.getConnection((err, connection) => {
//   if (err) {
//     console.error("❌ MySQL Connection Error:", err.message);
//   } else {
//     console.log("✅ Connected to AWS RDS MySQL Database!");
//     connection.release(); // ✅ Release connection back to the pool
//   }
// });


// import mysql from 'mysql2';
// import dotenv from 'dotenv';
// dotenv.config();

// // ✅ Create MySQL Connection Pool
// export const db = mysql.createPool({
//   host: process.env.DBHOSTNAME,
//   user: process.env.DBUSER,
//   password: process.env.DBPASSWORD,
//   database: process.env.DBNAME,
// });

// // ✅ Check Database Connection
// db.getConnection((err, connection) => {
//   if (err) {
//     console.error('❌ Database Connection Error:', err.message);
//   } else {
//     console.log('✅ MySQL Database Connected!');
//     connection.release();
//   }
// });



import mysql from "mysql2";
import dotenv from 'dotenv';
dotenv.config();

// ✅ Define Connection with Production DB on Render
export const db = mysql.createConnection({
  host: process.env.DBHOSTNAME, // ✅ Render DB Host
  user: process.env.DBUSER, // ✅ DB User
  password: process.env.DBPASSWORD, // ✅ DB Password
  database: process.env.DBNAME, // ✅ DB Name
  port: 3306, // ✅ MySQL Port
});

// ✅ Connect to DB and Handle Errors
db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Error:", err.message);
    process.exit(1);
  }
  console.log("✅ Database Connected Successfully!");
});
