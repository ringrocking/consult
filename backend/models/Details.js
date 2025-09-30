const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phonenumber: { type: String, required: true },
  highesteducation: { type: String, required: true },  
  yearofpassing: { type: String, required: true },  
});

module.exports = mongoose.model("Details", detailsSchema);

