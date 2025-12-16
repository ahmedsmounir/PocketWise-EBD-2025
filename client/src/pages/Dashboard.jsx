import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [spentToday, setSpentToday] = useState(0);

  // --- 1. FETCH DATA (SECURE) ---
  useEffect(() => {
    // 1. Check for Token
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) { 
        navigate('/login'); 
        return; 
    }

    // 2. Fetch User Data (With Badge)
    axios.get(`http://localhost:5000/api/auth/user/${userId}`, {
        headers: { 'auth-token': token } // SECURITY HEADER
    })
      .then(res => setUser(res.data))
      .catch(err => console.error("User Fetch Error:", err));

    // 3. Fetch Transactions (With Badge)
    axios.get('http://localhost:5000/api/transactions', {
        headers: { 'auth-token': token } // SECURITY HEADER
    })
      .then(res => {
         const today = new Date().setHours(0,0,0,0);
         let total = 0;
         // Calculate Spent Today
         res.data.forEach(t => {
             if(new Date(t.date).setHours(0,0,0,0) === today) total += Number(t.amount);
         });
         setSpentToday(total);
      })
      .catch(err => console.error("Transaction Fetch Error:", err));
  }, [navigate]);

  // --- 2. EDIT BUDGET FUNCTION (SECURE) ---
  const handleEditBudget = () => {
    const newBudget = prompt("Enter your new Monthly Allowance (EGP):");
    
    if (newBudget && Number(newBudget) > 0) {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token"); // Get Badge
        
        axios.put(`http://localhost:5000/api/auth/update-budget/${userId}`, 
            { newAllowance: newBudget },
            { headers: { 'auth-token': token } } // SECURITY HEADER
        )
        .then(res => {
            alert("Budget updated! Recalculating...");
            window.location.reload();
        })
        .catch(err => alert("Error updating budget"));
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
        
        {/* Card 1: Daily Limit */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
             <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Daily Limit</p>
             <button 
                onClick={handleEditBudget} 
                style={{
                    border: 'none', background: '#e0f2fe', color: '#0284c7', 
                    cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px'
                }}
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