const express = require('express');
const router = express.Router();
const SegregateBin = require('../models/segregateBin'); // Import the blueprint

// @route   GET /api/bins
// @desc    Get all bins for map view
router.get("/", async (req, res) => {
    try {
        const bins = await SegregateBin.find();
        // Transform data to match frontend expectations
        const formattedBins = bins.map(bin => ({
            _id: bin._id,
            bin_id: bin.bin_id,
            name: bin.name || `Bin Cluster ${bin.bin_id}`,
            location: bin.location || "Unknown Location",
            coordinates: bin.coordinates || { lat: 6.8792, lng: 79.8853 },
            fillLevels: {
                organic: bin.organic?.fill_level || 0,
                plastic: bin.plastic?.fill_level || 0,
                glass: bin.glass?.fill_level || 0
            },
            status: bin.status || "active"
        }));
        res.status(200).json(formattedBins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logic to GET data for a specific bin ID
router.get("/:id", async (req, res) => {
    try {
        const fillData = await SegregateBin.findOne({ bin_id: req.params.id });
        if (!fillData) return res.status(404).json({ message: "Bin not found" });
        res.status(200).json(fillData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;