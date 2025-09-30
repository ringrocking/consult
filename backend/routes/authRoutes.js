const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
    phone,
    gender,
    role,
    dob,
    agreeToTerms,
  } = req.body;

  // Validate email and other required fields
  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Valid email is required" });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "Valid password is required" });
  }

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }



    // Create and save the new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      gender,
      role,
      dob,
      agreeToTerms,
    });
    await user.save();

    res.status(201).json({ message: "Signup successful", user });
  } catch (err) {
    res.status(500).json({ message: "Error during signup", error: err.message });
  }
});

// Login Route 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password == user.password?true:false;

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Error during login", error: err.message });
  }
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email, dob, newPassword } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Valid email is required" });
  }
  // if (!dob || typeof dob !== "string") {
  //   return res.status(400).json({ message: "Valid date of birth is required" });
  // }
  if (!newPassword || typeof newPassword !== "string") {
    return res.status(400).json({ message: "Valid new password is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.dob !== dob) {
      return res.status(401).json({ message: "Date of birth does not match our records" });
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
});

module.exports = router;
