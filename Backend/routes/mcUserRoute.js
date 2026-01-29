const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const MCUser = require('../models/McUser');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Domain Restriction Check
    if (!email.endsWith('@municipalcouncil.lk')) {
      return res.status(403).json({ 
        message: "Registration restricted to Municipal Council email addresses only." 
      });
    }

    // 2. Check if user already exists
    const existingUser = await MCUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // 3. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save to MC_User collection
    const newUser = new MCUser({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "Sign-up successful! You can now log in." });

  } catch (err) {
    res.status(500).json({ error: "Server error during registration." });
  }
});

module.exports = router;