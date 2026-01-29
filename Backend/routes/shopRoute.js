const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");

// GET all shops
router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET shop by ID
router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
