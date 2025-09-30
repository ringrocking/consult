const express = require("express");
const { verifyEmployer } = require("../middleware/authMiddleware");
const cloudinary = require("cloudinary").v2; // Cloudinary SDK
const Course = require("../models/Course");

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add a new course and upload image to Cloudinary
router.post("/", verifyEmployer, async (req, res) => {
  const {
    title,
    description,
    duration,
    perks,
    opportunities,
    badge,
    guarantee,
    rating,
    link,
    image, // Base64 image data from frontend
  } = req.body;

  if (
    !title ||
    !description ||
    !duration ||
    !perks ||
    !opportunities ||
    !guarantee ||
    !rating ||
    !link ||
    !image // Ensure image is provided
  ) {
    return res.status(400).json({ message: "All fields except badge are required" });
  }

  try {
    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "courses", // Cloudinary folder
    });

    const course = new Course({
      title,
      description,
      image: uploadResponse.secure_url, // Use Cloudinary URL
      duration,
      perks,
      opportunities,
      badge,
      guarantee,
      rating,
      link,
      createdBy: req.user.id,
    });

    await course.save();
    res.status(201).json({ message: "Course added successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a course by ID
router.patch("/:id", verifyEmployer, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the employer owns the course
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Handle image update if provided
    if (updates.image) {
      const uploadResponse = await cloudinary.uploader.upload(updates.image, {
        folder: "courses",
      });
      updates.image = uploadResponse.secure_url;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a course by ID
router.delete("/:id", verifyEmployer, async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the employer owns the course
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete the course image from Cloudinary
    const publicId = course.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`courses/${publicId}`);

    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
