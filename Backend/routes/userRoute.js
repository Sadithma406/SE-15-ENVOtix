const express = require('express');
const router = express.Router();
const User = require('../models/user');

// 2 POST - For creating a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, contactNumber, address, RFID, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { RFID }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Bin ID already registered." });
        }

        const newUser = new User({
            name,
            email,
            contact_number: contactNumber, // Maps frontend camelCase to DB underscore
            address,
            RFID,
            password,
            coin_balance: 0,
            coin_last_updated: new Date().toISOString()
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST - For verifying an existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Use .trim() to ensure no accidental spaces break the search
        const user = await User.findOne({ email: email.trim() });
        
        if (!user) {
            return res.status(404).json({ message: "No user account found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Password is incorrect" });
        }

        // Return the _id so the app knows WHO is logged in
        res.status(200).json({ userId: user._id, name: user.name });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});
// Ensure the parameter name matches what you use in the fetch URL
router.put('/update/:userId', async (req, res) => {
    try {
        const { name, email, contact_number, address } = req.body;

        // Use findByIdAndUpdate to target Laknidu's ID
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { 
                name, 
                email, 
                contact_number, // Must match your DB field exactly
                address 
            },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Success", user: updatedUser });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
// 3. GET - For fetching profile data (KEEP AT THE BOTTOM)
// Inside userRoute.js -> router.get('/:userId', ...)
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // FIX: Return exact keys as stored in MongoDB
        res.json({
            name: user.name,
            email: user.email,
            coin_balance: user.coin_balance, 
            coin_last_updated: user.coin_last_updated, 
            contact_number: user.contact_number, // Fixed
            address: user.address,
            RFID: user.RFID // Fixed
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;