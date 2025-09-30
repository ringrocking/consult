const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  activelyHiring: { type: Boolean, default: true },
  logo: { type: String }, 
  link: { type: String, required: true },
  type: { type: String, required: true },
  requirements: {
    skills: [String],
    location: String,
    workMode: String,
    salaryRange: String,
    duration: String,
  },
  description: {
    type: String,
    required: true,
  },
  additionalRequirements: {
    type: [String], // Optional additional requirements
  },
  numberOfOpenings: {
    type: Number,
    required: true,
    min: 1,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

});

module.exports = mongoose.model("Job", JobSchema);
