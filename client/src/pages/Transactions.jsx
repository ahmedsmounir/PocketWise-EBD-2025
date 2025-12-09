import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  // 1. FETCH DATA
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if(!userId) return;

    axios.get(`http://localhost:5000/api/transactions?userId=${userId}`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2. CREATE (Add)
  const handleAdd = (e) => {
    e.preventDefault();
    
    if (Number(amount) <= 0) {
        alert("Please enter a positive amount greater than 0.");
        return; // Stop here, do not send to server
    }
    const userId = localStorage.getItem("userId");

    axios.post('http://localhost:5000/api/transactions', {
        userId, title, amount, category, date: new Date()
    })
    .then(res => {
        window.location.reload(); 
    })
    .catch(err => {
        if (err.response && err.response.data) alert(err.response.data.message); 
    });
  };

  // 3. DELETE
  const handleDelete = (id) => {
    if(window.confirm("Delete this expense?")) {
        axios.delete(`http://localhost:5000/api/transactions/${id}`)
            .then(() => window.location.reload())
            .catch(err => alert("Error deleting"));
    }
  };

  // 4. UPDATE (Edit) - Fulfills "Full CRUD"
  const handleEdit = (id, oldAmount) => {
    const newAmount = prompt("Enter new amount:", oldAmount);
    if (newAmount && newAmount !== oldAmount) {
        axios.put(`http://localhost:5000/api/transactions/${id}`, { amount: newAmount })
            .then(() => window.location.reload())
            .catch(err => alert("Error updating"));
    }
  };

  return (
    <div className="container">
      <header style={{ margin: '30px 0' }}>
        <h1 style={{ fontSize: '28px', color: '#111827' }}>Transaction History</h1>
        <p style={{ color: '#6b7280' }}>Manage your expenses and track your spending.</p>
      </header>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* ADD FORM */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Add New Expense</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px', display: 'block' }}>Title</label>
              <input type="text" placeholder="e.g. Coffee" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px', display: 'block' }}>Amount</label>
              <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px', display: 'block' }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Food">🍔 Food</option>
                <option value="Transport">🚗 Transport</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Other">📝 Other</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Add Transaction</button>
          </form>
        </div>

        {/* LIST TABLE */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Recent Transactions</h3>
          
          {transactions.length === 0 ? (
            <p style={{ color: '#9ca3af', fontStyle: 'italic', padding: '20px 0' }}>No transactions found yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6', textAlign: 'left' }}>
                    <th style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>DATE</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>TITLE</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>CATEGORY</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>AMOUNT</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: '#6b7280' }}>{new Date(t.date).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 12px', fontWeight: '500', color: '#1f2937' }}>{t.title || t.desc}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: '#e0f2fe', color: '#0284c7' }}>{t.category}</span>
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '600', color: '#ef4444' }}>-{Math.round(t.amount)} EGP</td>
                      
                      {/* ACTION BUTTONS */}
                      <td style={{ padding: '16px 12px', display: 'flex', gap: '10px' }}>
                        {/* Edit Button */}
                        <button 
                            onClick={() => handleEdit(t._id, t.amount)} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                            title="Edit Amount"
                        >
                            ✏️
                        </button>
                        {/* Delete Button */}
                        <button 
                            onClick={() => handleDelete(t._id)} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.6 }}
                            title="Delete"
                        >
                            🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Transactions;