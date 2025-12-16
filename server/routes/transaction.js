const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User'); // 1. IMPORT USER MODEL (Needed for Daily Limit)
const verify = require('../middleware/auth');

// --- 1. GET TRANSACTIONS (SECURE) ---
router.get('/', verify, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- 2. ADD TRANSACTION (SECURE + GATEKEEPER) ---
router.post('/', verify, async (req, res) => {
    const { amount, category, title, date } = req.body;
    const userId = req.user.id; // Get ID from Token

    // Basic Validation
    if (Number(amount) <= 0) return res.status(400).json({ message: "Amount must be positive" });

    try {
        // A. Find the User to get their Daily Limit
        const user = await User.findById(userId);
        if (!user) return res.status(404).json("User not found");

        // B. Calculate "Spent Today"
        // (We fetch all transactions and filter for today)
        const allTransactions = await Transaction.find({ userId: userId });
        
        let spentToday = 0;
        const todayStart = new Date();
        todayStart.setHours(0,0,0,0); // Midnight today

        allTransactions.forEach(t => {
            const tDate = new Date(t.date);
            // Check if transaction date is same as today
            if (tDate.setHours(0,0,0,0) === todayStart.getTime()) {
                spentToday += Number(t.amount);
            }
        });

        // C. THE GATEKEEPER CHECK 🛑
        // If (Current Spending + New Item) > Limit -> REJECT
        if ((spentToday + Number(amount)) > user.dailyLimit) {
            return res.status(400).json({ 
                message: `Transaction Rejected! You only have ${(user.dailyLimit - spentToday).toFixed(2)} EGP left today.` 
            });
        }

        // D. Save Transaction (If passed checks)
        const newTrans = new Transaction({
            userId: userId,
            title,
            amount,
            category,
            date
        });

        const savedTrans = await newTrans.save();
        res.status(200).json(savedTrans);

    } catch (err) {
        res.status(500).json(err);
    }
});

// --- 3. DELETE TRANSACTION (SECURE) ---
router.delete('/:id', verify, async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- 4. UPDATE TRANSACTION (SECURE) ---
router.put('/:id', verify, async (req, res) => {
    try {
        await Transaction.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json("Updated");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;