import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default requireAuth;
