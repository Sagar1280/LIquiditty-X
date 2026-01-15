import express from "express";
import User from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const router = express.Router();

// --- SIGNUP ---
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "User already exists" });

    const hashed = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    await User.create({
      email,
      password: hashed,
      refreshToken: null,
    });

    return res.json({ msg: "Signup Success!" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User does not exist" });

    const valid = await argon2.verify(user.password, password);
    if (!valid)
      return res.status(400).json({ msg: "Wrong password" });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user: { email: user.email },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// --- REFRESH ---
router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ msg: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ msg: "User not found" });

    if (user.refreshToken !== token)
      return res.status(403).json({ msg: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    return res.json({
      accessToken,
      user: { email: user.email },
    });

  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Invalid refresh token" });
  }
});

// --- LOGOUT ---
router.post("/logout", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const payload = jwt.decode(token);
    await User.findByIdAndUpdate(payload.id, { refreshToken: null });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.json({ msg: "Logged out" });
});

export default router;
