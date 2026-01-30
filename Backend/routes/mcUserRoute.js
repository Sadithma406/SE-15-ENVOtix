router.post('/signup', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // 1. Basic Presence Check
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Domain Restriction Check
    if (!normalizedEmail.endsWith('@municipalcouncil.lk')) {
      return res.status(403).json({ 
        message: "Registration restricted to Municipal Council email addresses only." 
      });
    }

    // 3. Password Validation (DO THIS BEFORE HASHING)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long and include letters, numbers, and symbols." 
      });
    }

    // 4. Check if user already exists
    const existingUser = await MCUser.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // 5. Hash the password ONLY after it passes validation
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Save
    const newUser = new MCUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "Sign-up successful!" });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});