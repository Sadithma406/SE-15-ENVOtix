const mongoose = require('mongoose');

const LaneBinSchema = new mongoose.Schema({
  laneName: {type: String,required: true,trim: true},
  binType: {type: String,required: true,enum: ['Plastic', 'Glass', 'Organic']}, // Added based on typical Envotix types},
  fillLevel: {type: Number,required: true,min: 0,max: 100},
  status: {type: String,required: true,enum: ['active', 'warning', 'full'],default: 'active'},
  location: {
    latitude: {type: Number,required: true},
    longitude: {type: Number,required: true}
  },
  lastUpdated: {type: Date,default: Date.now}
});

// Explicitly naming the collection 'laneBins' to stay organized
module.exports = mongoose.model('LaneBin', LaneBinSchema, 'lane_bins');