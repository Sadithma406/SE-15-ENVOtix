const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact_number: { type: String, required: true }, // Must match DB key
  address: { type: String, required: true },
  coin_balance: { type: Number, default: 0 },
  coin_last_updated: { type: String, default: new Date().toISOString() },
  RFID: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Explicitly name  of the collection  by 'users'
module.exports = mongoose.model('user', UserSchema, 'users');