const express = require('express');
const router = express.Router();
const LaneBin = require('../models/laneBin');

// @route   GET /api/lanebins
// @desc    Get all lane bins for dashboard analysis
router.get('/', async (req, res) => {
    try {
        const bins = await LaneBin.find();
        
        // Check if bins exist
        if (!bins || bins.length === 0) {
            return res.status(404).json({ message: "No bin data found in the database." });
        }

        res.status(200).json(bins);
    } catch (err) {
        console.error("Dashboard Fetch Error:", err.message);
        res.status(500).json({ 
            message: "Server error retrieving bin data for analytics",
            error: err.message 
        });
    }
});

// @route   GET /api/lanebins/:id
// @desc    Get a single bin's details (useful for specific map markers)
router.get('/:id', async (req, res) => {
    try {
        const bin = await LaneBin.findById(req.params.id);
        if (!bin) return res.status(404).json({ message: "Bin not found" });
        res.json(bin);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bin details" });
    }
});

module.exports = router;