const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const MCUser = require('../models/McUser'); 

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
         if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

        // Domain Restriction Check
        if (!normalizedEmail.endsWith('@municipalcouncil.lk')) {
            return res.status(403).json({ 
                message: "Registration restricted to Municipal Council email addresses only." 
            });
        }

        // Check if user already exists
        const existingUser = await MCUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists. Try signing in." });
        }
   
        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to the collection
        const newUser = new MCUser({
            name:name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "Sign-up successful! You can now log in." });

    } catch (err) {
        console.error("Signup Route Error:", err); // Log the specific error
        res.status(500).json({ error: "Server error during registration." });
    }
});

module.exports = router;