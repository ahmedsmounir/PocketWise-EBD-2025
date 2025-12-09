const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const savingsRoute = require('./routes/savings'); // <--- ADD THIS
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pocketwise')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
  
// Import Routes
const authRoute = require('./routes/auth');
const transactionRoute = require('./routes/transaction');

// Use Routes
app.use('/api/auth', authRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/savings', savingsRoute); // <--- ADD THIS

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));