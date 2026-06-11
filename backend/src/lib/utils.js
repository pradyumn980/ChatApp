import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  if (res) {
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      httpOnly: true,                 // Protects from XSS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-site cookie in prod, lax for dev
      secure: process.env.NODE_ENV === "production", // only HTTPS in production
      path: "/",                      // apply cookie globally
    });
  }

  return token;
};
