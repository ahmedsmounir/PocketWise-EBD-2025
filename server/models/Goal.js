const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    goalName: { type: String, required: true }, // Changed from title
    targetAmount: { type: Number, required: true },
    currentSaved: { type: Number, default: 0 }, // Changed from currentAmount
    deadline: { type: Date }
});

module.exports = mongoose.model('Goal', GoalSchema);