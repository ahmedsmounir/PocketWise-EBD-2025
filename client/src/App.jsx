import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // <--- IMPORT THIS

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Savings from './pages/Savings';

function App() {
  return (
    <Router>
      <Navbar /> {/* <--- ADD THIS HERE */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/savings" element={<Savings />} />
      </Routes>
    </Router>
  );
}

export default App;