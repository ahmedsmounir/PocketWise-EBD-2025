import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [spentToday, setSpentToday] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { navigate('/login'); return; }

    // Fetch User Data
    axios.get(`http://localhost:5000/api/auth/user/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    // Fetch Transactions to calculate spending
    axios.get(`http://localhost:5000/api/transactions?userId=${userId}`)
      .then(res => {
         const today = new Date().setHours(0,0,0,0);
         let total = 0;
         res.data.forEach(t => {
             if(new Date(t.date).setHours(0,0,0,0) === today) total += Number(t.amount);
         });
         setSpentToday(total);
      })
      .catch(err => console.error(err));
  }, [navigate]);

  // --- NEW: EDIT BUDGET FUNCTION ---
  const handleEditBudget = () => {
    const newBudget = prompt("Enter your new Monthly Allowance (EGP):");
    
    // Validation: Must be exists AND be greater than 0
    if (newBudget && Number(newBudget) > 0) {
        const userId = localStorage.getItem("userId");
        
        axios.put(`http://localhost:5000/api/auth/update-budget/${userId}`, { newAllowance: newBudget })
            .then(res => {
                alert("Budget updated successfully! Recalculating limits...");
                window.location.reload(); // Refresh to show new numbers
            })
            .catch(err => alert("Error updating budget. Make sure the backend route exists!"));
    } else if (newBudget) {
        alert("Invalid amount. Please enter a positive number.");
    }
  };

  if (!user) return <div className="container" style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

  const dailyLimit = user.dailyLimit ? Number(user.dailyLimit) : 0;
  const remaining = dailyLimit - spentToday;
  const isLow = remaining < 20;

  return (
    <div className="container">
      {/* 1. Header Section */}
      <header style={{ margin: '40px 0', textAlign: 'left' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Welcome back, {user.username || 'User'} 👋</h1>
        <p style={{ color: '#6b7280' }}>Here is your financial overview for today.</p>
      </header>

      {/* 2. Stats Grid */}
      <div className="grid-3">
        
        {/* Card 1: Daily Limit (WITH EDIT BUTTON) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
             <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Daily Limit</p>
             {/* The Edit Button */}
             <button 
                onClick={handleEditBudget} 
                style={{
                    border: 'none', 
                    background: '#e0f2fe', 
                    color: '#0284c7', 
                    cursor: 'pointer', 
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                }}
                title="Change Monthly Budget"
             >
                ✏️ Edit
             </button>
          </div>
          <h2 style={{ fontSize: '32px', margin: 0, color: '#1f2937' }}>{Math.round(dailyLimit)} EGP</h2>
        </div>

        {/* Card 2: Spent Today */}
        <div className="card">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>Spent Today</p>
          <h2 style={{ fontSize: '32px', margin: 0, color: '#ef4444' }}>{Math.round(spentToday)} EGP</h2>
        </div>

        {/* Card 3: Remaining */}
        <div className="card" style={{ borderLeft: `5px solid ${isLow ? '#ef4444' : '#10b981'}` }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>Remaining</p>
          <h2 style={{ fontSize: '32px', margin: 0, color: isLow ? '#ef4444' : '#10b981' }}>
            {Math.round(remaining)} EGP
          </h2>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '20px', color: '#374151' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/transactions" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '16px' }}>
             + Add Expense
          </Link>
          <Link to="/savings" className="btn btn-success" style={{ padding: '15px 30px', fontSize: '16px' }}>
             View Savings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;