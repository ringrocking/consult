const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
    firstName : { type: String, required: true },
    lastName :  { type: String, required: false },
    email :  { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    confirmPassword :  { type: String, required: true },
    phone :  { type: String, required: true, unique: true },
    gender :  { type: String, required: true },
    role :  { type: String, required: true },
    dob :  { type: String, required: true },
    agreeToTerms: { type: Boolean, default: false },

});

module.exports = mongoose.model('User', userSchema);
