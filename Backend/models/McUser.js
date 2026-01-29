const mongoose = require('mongoose');

const MCUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Use 'mcUsers' as the explicit collection name
module.exports = mongoose.model('MCUser', MCUserSchema, 'mcUsers');