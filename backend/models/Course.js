const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, required: true },
    perks: { type: String, required: true },
    opportunities: { type: String, required: true },
    badge: { type: String, default: null },
    guarantee: { type: String, required: true },
    rating: { type: Number, required: true },
    link: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
