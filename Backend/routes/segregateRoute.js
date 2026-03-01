const express = require('express');
const router = express.Router();
const SegregateBin = require('../models/segregateBin'); // Import the blueprint

// Logic to GET ALL bins (for debugging)
router.get("/", async (req, res) => {
    try {
        const allBins = await SegregateBin.find();
        res.status(200).json(allBins);
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