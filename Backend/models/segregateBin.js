const mongoose = require('mongoose');

const CompartmentSchema = new mongoose.Schema({
    fill_level: Number,
    last_updated: String
});

const SegregateBinSchema = new mongoose.Schema({
    bin_id: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    location: { type: String, default: "" },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    status: String,
    organic: CompartmentSchema,
    plastic: CompartmentSchema,
    glass: CompartmentSchema
});

// The first argument is the name of your COLLECTION IN MongoDB Atlas
module.exports = mongoose.model("SegregateBin", SegregateBinSchema, "segregate_bins");