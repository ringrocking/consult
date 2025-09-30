const express = require("express");
const User = require("../models/User");
const Job = require("../models/Job");
const Course = require("../models/Course");
const Details = require("../models/Details");
const { adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/dashboard", adminMiddleware, async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({}, "-password"); // Exclude passwords for security

    // Fetch all jobs
    const jobs = await Job.find({}); // Fetch all jobs

    // Fetch all courses
    const courses = await Course.find({}); // Fetch all courses

    const details = await Details.find(); // Fetch all details from the database

    res.status(200).json({
      message: "Admin dashboard data fetched successfully",
      data: {
        users,
        jobs,
        courses,
        details,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching admin dashboard data",
      error: err.message,
    });
  }
});

module.exports = router;
