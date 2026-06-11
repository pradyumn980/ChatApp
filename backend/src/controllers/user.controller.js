import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json([]); // Return empty array if query missing
  }
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { username: { $regex: query, $options: "i" } },  // if you have username in your schema
        { fullName: { $regex: query, $options: "i" } }
      ]
    }).select("_id username fullName profilePic");

    res.json(users);
  } catch (error) {
    console.error("searchUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
