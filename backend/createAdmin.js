const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("./models/User");

mongoose.connect("mongodb+srv://rjsingh4997:2CtDQ4RwsVwTYi6a@cluster0.mjrqg.mongodb.net/prology?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const createAdmin = async () => {
  try {
    const admin = new User({
      firstName: "arshad khan",
      gender: "Male",
      phone: "1234567893",
      password: "adminpassword",
      confirmPassword: "adminpassword",
      email: "admin@example.com", 
      dob: "12-14-2006",
      role: "Admin",
      isApproved: true, // Admins are always approved
    });

    await admin.save();
    console.log("Admin created successfully!");
  } catch (err) {
    console.error("Error creating admin:", err.message);
  }
};



createAdmin();
