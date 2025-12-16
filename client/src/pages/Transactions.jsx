import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  // --- 1. FETCH TRANSACTIONS (SECURE) ---
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get Badge
    if (!token) return;

    // Send Token in Header
    axios.get('http://localhost:5000/api/transactions', {
        headers: { 'auth-token': token }
    })
      .then(res => setTransactions(res.data))
      .catch(err => console.log(err));
  }, []);

  // --- 2. ADD TRANSACTION (SECURE) ---
  const handleAdd = (e) => {
    e.preventDefault();
    
    // Frontend Validation (Optional but good)
    if (Number(amount) <= 0) {
        alert("Please enter a positive amount.");
        return;
    }

    const token = localStorage.getItem("token"); // Get Badge

    axios.post('http://localhost:5000/api/transactions', 
        { 
            title, 
            amount, 
            category, 
            date: new Date() 
        },
        { 
            headers: { 'auth-token': token } // Send Badge
        } 
    )
    .then(res => {
        alert("Transaction Added!");
        window.location.reload();
    })
    .catch(err => {
        alert(err.response?.data?.message || "Error adding transaction");
    });
  };

  // --- 3. DELETE TRANSACTION (SECURE) ---
  const handleDelete = (id) => {
    const token = localStorage.getItem("token"); // Get Badge

    if(window.confirm("Are you sure you want to delete this?")) {
        axios.delete(`http://localhost:5000/api/transactions/${id}`, {
            headers: { 'auth-token': token } // Send Badge
        })
        .then(res => {
            window.location.reload();
        })
        .catch(err => alert("Error deleting transaction"));
    }
  };

  // --- 4. EDIT TRANSACTION (SECURE) ---
  const handleEdit = (id, oldAmount) => {
      const newAmount = prompt("Enter new amount:", oldAmount);
      if (newAmount && Number(newAmount) > 0) {
          const token = localStorage.getItem("token"); // Get Badge
          
          axios.put(`http://localhost:5000/api/transactions/${id}`, 
              { amount: newAmount },
              { headers: { 'auth-token': token } } // Send Badge
          )
          .then(res => window.location.reload())
          .catch(err => alert("Error updating transaction"));
      }
  };

  return (
    <div className="container">
      {/* Header */}
      <header style={{ margin: '30px 0' }}>
        <h1 style={{ fontSize: '28px', color: '#111827' }}>Transactions History</h1>
        <p style={{ color: '#6b7280' }}>Track your daily expenses here.</p>
      </header>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* LEFT: ADD FORM */}
        <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginTop: 0 }}>Add Expense 💸</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Title</label>
                    <input 
                        placeholder="e.g. Starbucks" 
                        value={title} onChange={e => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Amount (EGP)</label>
                    <input 
                        type="number" placeholder="0.00" 
                        value={amount} onChange={e => setAmount(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="Food">🍔 Food</option>
                        <option value="Transport">🚗 Transport</option>
                        <option value="Shopping">🛍️ Shopping</option>
                        <option value="Other">🔌 Other</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    + Add Transaction
                </button>
            </form>
        </div>

        {/* RIGHT: TABLE */}
        <div className="card">
            <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
            {transactions.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No transactions found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f3f4f6', textAlign: 'left', color: '#6b7280', fontSize: '14px' }}>
                            <th style={{ padding: '10px' }}>Title</th>
                            <th style={{ padding: '10px' }}>Category</th>
                            <th style={{ padding: '10px' }}>Date</th>
                            <th style={{ padding: '10px' }}>Amount</th>
                            <th style={{ padding: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{t.title}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ 
                                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                                        background: t.category === 'Food' ? '#fee2e2' : '#e0f2fe',
                                        color: t.category === 'Food' ? '#ef4444' : '#0284c7'
                                    }}>
                                        {t.category}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>
                                    {new Date(t.date).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#ef4444' }}>
                                    -{t.amount} EGP
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {/* Edit Button */}
                                    <button 
                                        onClick={() => handleEdit(t._id, t.amount)}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}
                                        title="Edit Amount"
                                    >
                                        ✏️
                                    </button>
                                    {/* Delete Button */}
                                    <button 
                                        onClick={() => handleDelete(t._id)}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;