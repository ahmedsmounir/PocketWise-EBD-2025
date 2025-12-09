const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// --- ⚠️ THIS WAS MISSING! ---
// GET TRANSACTIONS (For the Table)
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        let transactions;
        // Filter by user ID so you don't see everyone's data
        if (userId) {
            transactions = await Transaction.find({ userId: userId });
        } else {
            transactions = [];
        }
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ADD TRANSACTION
router.post('/', async (req, res) => {
    // Added 'title' here so it saves correctly
    const { userId, amount, category, title } = req.body;
    if (Number(amount) <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number!" });
    }
    
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Calculate Spending
        const todayStart = new Date();
        todayStart.setHours(0,0,0,0);
        
        const todayTransactions = await Transaction.find({
            userId: userId,
            date: { $gte: todayStart }
        });

        let spentToday = 0;
        todayTransactions.forEach(t => spentToday += t.amount);

        // Check Limit
        const remaining = user.dailyLimit - spentToday;
        if (Number(amount) > remaining) {
            return res.status(400).json({ message: "Transaction DECLINED: Over Daily Limit!" });
        }

        // Save
        const newTrans = new Transaction({ userId, title, amount, category, date: new Date() });
        const savedTrans = await newTrans.save();
        res.status(200).json(savedTrans);

    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE TRANSACTION
router.delete('/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json("Transaction has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});
// UPDATE TRANSACTION (To fulfill CRUD)
router.put('/:id', async (req, res) => {
    try {
        const { amount } = req.body;
        // Simple update: just update the amount
        const updatedTrans = await Transaction.findByIdAndUpdate(
            req.params.id, 
            { amount: amount },
            { new: true }
        );
        res.status(200).json(updatedTrans);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;