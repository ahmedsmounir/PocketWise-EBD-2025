import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Savings() {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH GOALS (SECURE) ---
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Get Badge

    if(!userId || !token) return;

    axios.get(`http://localhost:5000/api/savings?userId=${userId}`, {
        headers: { 'auth-token': token } // SECURITY HEADER
    })
      .then(res => {
        setGoals(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // --- 2. CREATE GOAL (SECURE) ---
  const handleCreate = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Get Badge

    axios.post('http://localhost:5000/api/savings', 
      {
        userId,
        goalName, 
        targetAmount: target
      },
      { headers: { 'auth-token': token } } // SECURITY HEADER
    )
    .then(res => window.location.reload())
    .catch(err => alert("Error creating goal"));
  };

  // --- 3. ADD FUNDS (SECURE) ---
  const handleAddFunds = (goalId) => {
    const amount = prompt("💰 How much do you want to save today?");
    if(!amount) return;

    const token = localStorage.getItem("token"); // Get Badge

    axios.put(`http://localhost:5000/api/savings/add-funds/${goalId}`, 
        { amount },
        { headers: { 'auth-token': token } } // SECURITY HEADER
    )
      .then(res => window.location.reload())
      .catch(err => alert("Error adding funds"));
  };

  // --- 4. DELETE / CASH OUT (SECURE) ---
  const handleDelete = (id, isCashOut = false) => {
    const message = isCashOut 
        ? "🎉 Congratulations! Are you ready to cash out this goal?" 
        : "Are you sure you want to delete this goal?";

    if(window.confirm(message)) {
        const token = localStorage.getItem("token"); // Get Badge

        // Notice: headers are the 2nd argument for axios.delete
        axios.delete(`http://localhost:5000/api/savings/${id}`, {
            headers: { 'auth-token': token } // SECURITY HEADER
        })
            .then(res => window.location.reload())
            .catch(err => alert("Error deleting goal"));
    }
  };

  if (loading) return <div className="container" style={{textAlign:'center', marginTop:'50px'}}>Loading Goals...</div>;

  return (
    <div className="container">
      {/* HEADER */}
      <header style={{ margin: '30px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h1 style={{ fontSize: '28px', color: '#111827', margin: 0 }}>Savings Goals</h1>
            <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Visualize your dreams and track your progress.</p>
        </div>
      </header>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* LEFT: CREATE CARD */}
        <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🎯 Start New Goal
            </h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px', display: 'block' }}>Goal Name</label>
                    <input 
                        placeholder="e.g. New Laptop" 
                        value={goalName} onChange={e => setGoalName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px', display: 'block' }}>Target Amount (EGP)</label>
                    <input 
                        type="number" placeholder="5000" 
                        value={target} onChange={e => setTarget(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                    Create Goal
                </button>
            </form>
        </div>

        {/* RIGHT: GOALS GRID */}
        <div>
            {goals.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    <h3>No goals yet 📉</h3>
                    <p>Create your first savings goal on the left to get started!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {goals.map(goal => {
                        const percent = Math.min((goal.currentSaved / goal.targetAmount) * 100, 100);
                        const isComplete = percent >= 100;

                        return (
                            <div key={goal._id} className="card" style={{ position: 'relative', overflow: 'hidden', border: isComplete ? '2px solid #10b981' : 'none' }}>
                                
                                {/* DELETE BUTTON (Trash Icon) */}
                                <button 
                                    onClick={() => handleDelete(goal._id)}
                                    style={{
                                        position: 'absolute', top: '15px', right: '15px',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: '16px', color: '#9ca3af'
                                    }}
                                    title="Delete Goal"
                                >
                                    🗑️
                                </button>

                                {/* Title Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingRight: '30px' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px' }}>{goal.goalName}</h3>
                                </div>

                                {/* Amount Row */}
                                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
                                    <strong style={{ color: isComplete ? '#10b981' : '#2563eb', fontSize: '18px' }}>{goal.currentSaved}</strong> 
                                    <span style={{ margin: '0 5px' }}>/</span> 
                                    {goal.targetAmount} EGP
                                </p>

                                {/* Progress Bar Container */}
                                <div style={{ width: '100%', background: '#f3f4f6', height: '12px', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${percent}%`, 
                                        background: isComplete ? '#10b981' : 'linear-gradient(90deg, #2563eb, #60a5fa)', 
                                        height: '100%', 
                                        borderRadius: '10px',
                                        transition: 'width 1s ease-in-out'
                                    }}></div>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '12px', color: '#6b7280' }}>
                                    <span>{Math.round(percent)}%</span>
                                    <span>{isComplete ? 'Goal Reached!' : 'Keep going!'}</span>
                                </div>

                                {/* LOGIC: If Complete, show "Cash Out". If not, show "Add Funds" */}
                                {isComplete ? (
                                    <button 
                                        onClick={() => handleDelete(goal._id, true)} 
                                        className="btn"
                                        style={{ 
                                            width: '100%', marginTop: '20px', 
                                            background: '#10b981', color: 'white', 
                                            border: 'none', fontWeight: 'bold'
                                        }}
                                    >
                                        🎉 Cash Out & Finish
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleAddFunds(goal._id)} 
                                        className="btn"
                                        style={{ 
                                            width: '100%', marginTop: '20px', 
                                            background: '#e0f2fe', color: '#0284c7', 
                                            border: '1px solid #bae6fd'
                                        }}
                                    >
                                        + Add Funds
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

export default Savings;