const express = require("express");
const cloudinary = require("cloudinary").v2; // Import Cloudinary
const { verifyEmployer } = require("../middleware/authMiddleware");
const Job = require("../models/Job");

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to add a job
router.post("/", verifyEmployer, async (req, res) => {  
  const { title, company, location, salary, activelyHiring, logo, link, type, requirements, description, additionalRequirements, numberOfOpenings } = req.body;

  try {
 
      const uploadResponse = await cloudinary.uploader.upload(logo, { folder: "logos" });    

    const job = new Job({
      title,
      company,
      location,
      salary,
      activelyHiring,
      logo: uploadResponse.secure_url,
      link,
      type,
      requirements,
      description,
      additionalRequirements,
      numberOfOpenings,
      createdBy: req.user.id,
    });

    await job.save();
    res.status(201).json({ message: "Job added successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to update a job
router.patch("/:id", verifyEmployer, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Find job and check ownership
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this job" });
    }

    // Update job fields
    Object.assign(job, updates);

    // Handle logo update if present
    if (updates.logo) {
      const uploadResponse = await cloudinary.uploader.upload(updates.logo, {
        folder: "jobs",
      });
      job.logo = uploadResponse.secure_url;
    }

    await job.save();
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to delete a job
router.delete("/:id", verifyEmployer, async (req, res) => {
  const { id } = req.params;

  try {
    // Find job and check ownership
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this job" });
    }

    // Delete job
    await Job.deleteOne({ _id: id });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
