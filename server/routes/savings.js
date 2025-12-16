const router = require('express').Router();
const Goal = require('../models/Goal');
const verify = require('../middleware/auth'); // Import Guard

// GET GOALS
router.get('/', verify, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id });
        res.status(200).json(goals);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE GOAL
router.post('/', verify, async (req, res) => {
    try {
        const newGoal = new Goal({
            userId: req.user.id,
            goalName: req.body.goalName,
            targetAmount: req.body.targetAmount,
            currentSaved: 0
        });
        const savedGoal = await newGoal.save();
        res.status(200).json(savedGoal);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ADD FUNDS
router.put('/add-funds/:id', verify, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        goal.currentSaved += Number(req.body.amount);
        await goal.save();
        res.status(200).json(goal);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE GOAL
router.delete('/:id', verify, async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.status(200).json("Goal deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;