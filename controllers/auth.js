// import { db } from "../connect.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();


// export const register = (req, res) => {
//   //CHECK USER IF EXISTS

//   const q = "SELECT * FROM users WHERE username = ?";

//   db.query(q, [req.body.username], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length) return res.status(409).json("User already exists!");
//     //CREATE A NEW USER
//     //Hash the password
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password, salt);

//     const q =
//       "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

//     const values = [
//       req.body.username,
//       req.body.email,
//       hashedPassword,
//       req.body.name,
//     ];

//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("User has been created.");
//     });
//   });
// };



// export const login = (req, res) => {
//   const q = "SELECT * FROM users WHERE email = ?";
  
//   db.query(q, [req.body.email], async (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length === 0) return res.status(404).json("User not found!");

//     const isPasswordCorrect = await bcrypt.compare(req.body.password, data[0].password);
//     if (!isPasswordCorrect) return res.status(400).json("Wrong password!");

//     // ✅ Generate JWT Token
//     const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     console.log("✅ Generated Token:", token);

//     // ✅ Set cookie
//     res.cookie("accessToken", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     });

//     res.status(200).json({
//       id: data[0].id,
//       username: data[0].username,
//       profilePic: data[0].profilePic,
//       token: token // ✅ Send token in response for debugging
//     });
//   });
// };


// export const logout = (req, res) => {
//   res.clearCookie("accessToken", {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//   }).status(200).json("User has been logged out.");
// };



import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json({ error: "User already exists!" });

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUES (?)";
    const values = [req.body.username, req.body.email, hashedPassword, req.body.name];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({ message: "User has been created." });
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], async (err, data) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (data.length === 0) return res.status(404).json({ error: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(req.body.password, data[0].password);
    if (!isPasswordCorrect) return res.status(400).json({ error: "Wrong password" });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Generated Token:", token);

    // ✅ SET Cookie Instead of Clearing It
    res.cookie("accessToken", token, {
      httpOnly: true, 
      secure: true, // Must be true in production (HTTPS)
      sameSite: "None",
    });

    // ✅ Return User Details & Token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: data[0].id,
        username: data[0].username,
        email: data[0].email,
        profilePic: data[0].profilePic
      },
      token: token
    });
  });
};



export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,   // ✅ Must match login settings
    sameSite: "none"
  }).status(200).json("User has been logged out.");
};
