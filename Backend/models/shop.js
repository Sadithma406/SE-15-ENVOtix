const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },        
  contactNumber: { type: String, required: true },
  image: { type: String, required: true }          
});

module.exports = mongoose.model("Shop", shopSchema);
