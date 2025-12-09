const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true }, // We added this for the description
    amount: { type: Number, required: true },
    category: { type: String, default: "Other" },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);