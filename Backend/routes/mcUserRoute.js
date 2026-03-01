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

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await MCUser.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        message: "User not found."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password."
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Server error during login."
    });
  }
});

// ===================== GOOGLE SIGNUP =====================
router.post('/google-signup', async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;

    if (!name || !email || !googleId) {
      return res.status(400).json({ message: "Missing required Google account information." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Domain Restriction Check for Google signup
    if (!normalizedEmail.endsWith('@municipalcouncil.lk')) {
      return res.status(403).json({ 
        message: "Registration restricted to Municipal Council email addresses only." 
      });
    }

    // Check if user already exists
    const existingUser = await MCUser.findOne({ 
      $or: [{ email: normalizedEmail }, { googleId }] 
    });

    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists. Try signing in." });
    }

    // Create new user with Google credentials (no password needed)
    const newUser = new MCUser({
      name: name.trim(),
      email: normalizedEmail,
      googleId,
      picture: picture || '',
      password: null // Google users don't have a password
    });

    await newUser.save();
    res.status(201).json({ message: "Sign-up successful with Google! You can now log in." });

  } catch (err) {
    console.error("Google Signup Error:", err);
    res.status(500).json({ message: "Server error during Google registration." });
  }
});

// ===================== GOOGLE LOGIN =====================
router.post('/google-login', async (req, res) => {
  try {
    const { email, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Missing Google credentials." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await MCUser.findOne({ 
      email: normalizedEmail,
      googleId 
    });

    if (!user) {
      return res.status(400).json({ message: "No account found. Please sign up first." });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Server error during Google login." });
  }
});

module.exports = router;