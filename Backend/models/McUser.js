const mongoose = require('mongoose');

const MCUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Not required for Google users
  googleId: { type: String, default: null },
  picture: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Use 'mcUsers' as the explicit collection name at macbook
module.exports = mongoose.model('MCUser', MCUserSchema, 'mcUsers');