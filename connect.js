// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();



// export const db = mysql.createConnection({
//   host:process.env.DBHOSTNAME,
//   user:process.env.DBUSER,
//   password:process.env.DBPASSWORD,
//   database:process.env.DBNAME
// })

// import mysql from "mysql2";
// import dotenv from "dotenv";
// dotenv.config();

// export const db = mysql.createPool({
//   host: process.env.DBHOSTNAME,
//   user: process.env.DBUSER,
//   password: process.env.DBPASSWORD,
//   database: process.env.DBNAME,
//   port: 3306, // ✅ Add port explicitly
//   waitForConnections: true,
//   connectionLimit: 10, // ✅ Keep multiple connections alive
//   queueLimit: 0
// });

// db.getConnection((err, connection) => {
//   if (err) {
//     console.error("❌ MySQL Connection Error:", err);
//   } else {
//     console.log("✅ Connected to AWS RDS MySQL Database!");
//     connection.release();
//   }
// });



import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables

// ✅ Create Database Pool
export const db = mysql.createPool({
  host: process.env.DBHOSTNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  port: 3306, // ✅ Explicitly define port for MySQL
  waitForConnections: true, // ✅ Maintain connection pool
  connectionLimit: 10, // ✅ Allow 10 concurrent connections
  queueLimit: 0, // ✅ Unlimited queue (optional, but safe for now)
});

// ✅ Check Database Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err.message);
  } else {
    console.log("✅ Connected to AWS RDS MySQL Database!");
    connection.release(); // ✅ Release connection back to the pool
  }
});
