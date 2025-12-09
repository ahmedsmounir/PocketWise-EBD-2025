const router = require('express').Router();
const Goal = require('../models/Goal');

// GET
router.get('/', async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.query.userId });
        res.status(200).json(goals);
    } catch (err) { res.status(500).json(err); }
});

// CREATE
router.post('/', async (req, res) => {
    try {
        const newGoal = new Goal({
            userId: req.body.userId,
            goalName: req.body.goalName, // Updated
            targetAmount: req.body.targetAmount,
            currentSaved: 0 // Updated
        });
        const savedGoal = await newGoal.save();
        res.status(200).json(savedGoal);
    } catch (err) { res.status(500).json(err); }
});

// ADD FUNDS
router.put('/add-funds/:id', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        goal.currentSaved += Number(req.body.amount); // Updated
        const updatedGoal = await goal.save();
        res.status(200).json(updatedGoal);
    } catch (err) { res.status(500).json(err); }
});
// DELETE GOAL
router.delete('/:id', async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.status(200).json("Goal deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;