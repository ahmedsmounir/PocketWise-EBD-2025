const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Import JWT

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            monthlyAllowance: req.body.monthlyAllowance,
            dailyLimit: req.body.monthlyAllowance / 30
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    console.log("1. Login Attempt:", req.body.email);

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Wrong password");

        console.log("2. Password Correct. Generating Token...");

        // 3. GENERATE JWT TOKEN (Readme Requirement)
        const token = jwt.sign(
            { id: user._id, email: user.email },
            "SecretKey123", // In production, use process.env.JWT_SECRET
            { expiresIn: "5d" }
        );

        // 4. Send Token + User Data
        res.status(200).json({ 
            _id: user._id, 
            email: user.email, 
            username: user.username,
            token: token 
        });

    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json(err);
    }
});

// GET USER (For Dashboard)
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json("User not found");
        
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});
// UPDATE BUDGET
router.put('/update-budget/:id', async (req, res) => {
    try {
        const { newAllowance } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json("User not found");

        // Update Allowance AND Recalculate Daily Limit
        user.monthlyAllowance = newAllowance;
        user.dailyLimit = newAllowance / 30;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;