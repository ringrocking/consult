const express = require("express");

const router = express.Router();

const Details = require("../models/Details.js");



router.post("/", async (req, res) => {
  try {
    const { name, email, phonenumber, highesteducation, yearofpassing  } = req.body;

    if (!name || !email || !phonenumber || !highesteducation || !yearofpassing) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Save data to the database
    const newDetails = new Details({
      name,
      email,
      phonenumber,
      highesteducation,
      yearofpassing,
    });
    await newDetails.save();

    res.status(201).json({ message: "Details saved successfully." });
  } catch (error) {
    console.error("Error saving details:", error.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;