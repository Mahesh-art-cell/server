

// import connectDB from "../connect.js";
// import dotenv from "dotenv";
// dotenv.config();


// import Relationship from "../models/Relationship.js";
// import jwt from "jsonwebtoken";

// export const getRelationships = async (req, res) => {
//   try {
//     const { followedUserId } = req.query;

//     if (!followedUserId) {
//       return res.status(400).json("followedUserId is required");
//     }

//     const relationships = await Relationship.find({ followedUserId }).select("followerUserId");
//     return res.status(200).json(relationships.map(r => r.followerUserId));
//   } catch (err) {
//     console.error("❌ Error fetching relationships:", err);
//     res.status(500).json(err);
//   }
// };

// export const addRelationship = async (req, res) => {
//   // const token = req.cookies.accessToken;
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   console.log("Incoming Authorization Header:", req.headers.authorization);
// console.log("Token from cookies:", req.cookies.accessToken);
// console.log("Token from headers:", req.headers.authorization?.split(" ")[1]);

//   if (!token) return res.status(401).json("Not logged in!");

//   try {
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);
//     const { followedUserId } = req.body;

//     if (!followedUserId) return res.status(400).json("followedUserId is required");

//     await Relationship.create({ followerUserId: userInfo.id, followedUserId });
//     return res.status(200).json("Following");
//   } catch (err) {
//     console.error("❌ Error adding relationship:", err);
//     res.status(500).json(err);
//   }
// };



// export const deleteRelationship = async (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json("Not logged in!");

//   try {
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);
//     const { userId } = req.query;

//     await Relationship.findOneAndDelete({ followerUserId: userInfo.id, followedUserId: userId });
//     return res.status(200).json("Unfollowed");
//   } catch (err) {
//     console.error("❌ Error deleting relationship:", err);
//     res.status(500).json(err);
//   }
// };


// import User from "../models/User.js"; // Assume User model is defined


// export const getSuggestions = async (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json("Not logged in!");

//   try {
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);

//     const following = await Relationship.find({ followerUserId: userInfo.id }).select("followedUserId");
//     const followingIds = following.map(r => r.followedUserId.toString());

//     const suggestions = await User.find({
//       _id: { $ne: userInfo.id, $nin: followingIds }
//     }).select("_id username profilePic"); // ✅ Select _id instead of id

//     // ✅ Map _id to id before sending response
//     const suggestionsWithId = suggestions.map(user => ({
//       id: user._id,
//       username: user.username,
//       profilePic: user.profilePic,
//     }));

//     return res.status(200).json(suggestionsWithId);
//   } catch (err) {
//     console.error("❌ Error getting suggestions:", err);
//     res.status(500).json(err);
//   }
// };


// export const getCounts = async (req, res) => {
//   const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json("Not logged in!");

//   try {
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);

//     const followers = await Relationship.countDocuments({ followedUserId: userInfo.id });
//     const following = await Relationship.countDocuments({ followerUserId: userInfo.id });

//     return res.status(200).json({ followers, following });
//   } catch (err) {
//     console.error("❌ Error fetching counts:", err);
//     res.status(500).json(err);
//   }
// };


// export const getFollowingIds = async (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json("Not logged in!");

//   try {
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);

//     const following = await Relationship.find({ followerUserId: userInfo.id }).select("followedUserId");
//     const ids = following.map((r) => r.followedUserId.toString());

//     return res.status(200).json(ids);
//   } catch (err) {
//     console.error("❌ Error getting following IDs:", err);
//     res.status(500).json(err);
//   }
// };



import connectDB from "../connect.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Relationship from "../models/Relationship.js";
import User from "../models/User.js";

dotenv.config();

// ✅ Unified token extractor
const getTokenFromReq = (req) => {
  return req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
};

export const getRelationships = async (req, res) => {
  try {
    const { followedUserId } = req.query;

    if (!followedUserId) {
      return res.status(400).json("followedUserId is required");
    }

    const relationships = await Relationship.find({ followedUserId }).select("followerUserId");
    return res.status(200).json(relationships.map(r => r.followerUserId));
  } catch (err) {
    console.error("❌ Error fetching relationships:", err);
    res.status(500).json(err);
  }
};

export const addRelationship = async (req, res) => {
  const token = getTokenFromReq(req);

  console.log("Incoming Authorization Header:", req.headers.authorization);
  console.log("Token from cookies:", req.cookies.accessToken);
  console.log("Token from headers:", req.headers.authorization?.split(" ")[1]);

  if (!token) return res.status(401).json("Not logged in!");

  // try {
  //   const userInfo = jwt.verify(token, process.env.JWT_SECRET);
  //   const { followedUserId } = req.body;

  //   if (!followedUserId) return res.status(400).json("followedUserId is required");

  //   await Relationship.create({ followerUserId: userInfo.id, followedUserId });
  //   return res.status(200).json("Following");
  // } catch (err) {
  //   console.error("❌ Error adding relationship:", err);
  //   res.status(500).json(err);
  // }

  try {
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
  const { followedUserId } = req.body;

  if (!followedUserId) return res.status(400).json("followedUserId is required");

  await Relationship.create({ followerUserId: userInfo.id, followedUserId });
  return res.status(200).json("Following");
} catch (err) {
  console.error("❌ JWT VERIFY ERROR:", err.message); // <---- Add this
  res.status(500).json(err.message); // <---- Return actual error to debug
}

};

export const deleteRelationship = async (req, res) => {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = req.query;

    await Relationship.findOneAndDelete({
      followerUserId: userInfo.id,
      followedUserId: userId,
    });

    return res.status(200).json("Unfollowed");
  } catch (err) {
    console.error("❌ Error deleting relationship:", err);
    res.status(500).json(err);
  }
};

export const getSuggestions = async (req, res) => {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const following = await Relationship.find({ followerUserId: userInfo.id }).select("followedUserId");
    const followingIds = following.map(r => r.followedUserId.toString());

    const suggestions = await User.find({
      _id: { $ne: userInfo.id, $nin: followingIds },
    }).select("_id username profilePic");

    const suggestionsWithId = suggestions.map(user => ({
      id: user._id,
      username: user.username,
      profilePic: user.profilePic,
    }));

    return res.status(200).json(suggestionsWithId);
  } catch (err) {
    console.error("❌ Error getting suggestions:", err);
    res.status(500).json(err);
  }
};

export const getCounts = async (req, res) => {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const followers = await Relationship.countDocuments({ followedUserId: userInfo.id });
    const following = await Relationship.countDocuments({ followerUserId: userInfo.id });

    return res.status(200).json({ followers, following });
  } catch (err) {
    console.error("❌ Error fetching counts:", err);
    res.status(500).json(err);
  }
};

export const getFollowingIds = async (req, res) => {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const following = await Relationship.find({ followerUserId: userInfo.id }).select("followedUserId");
    const ids = following.map(r => r.followedUserId.toString());

    return res.status(200).json(ids);
  } catch (err) {
    console.error("❌ Error getting following IDs:", err);
    res.status(500).json(err);
  }
};
