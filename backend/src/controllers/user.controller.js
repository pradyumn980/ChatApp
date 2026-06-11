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
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).select("_id fullName email profilePic");

    res.json(users);
  } catch (error) {
    console.error("searchUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
