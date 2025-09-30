const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv")
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const detailsRoutes = require("./routes/detailsRoutes.js");
const courseRoutes = require("./routes/courseRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Parse incoming JSON requests


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/details", detailsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/job", jobRoutes);



// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {

    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process if MongoDB connection fails
  }
};

connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  


