import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/auth/login', { email, password })
      .then(result => {
        // SECURITY FIX: Check if we got a token!
        if(result.data.token) {
            // 1. SAVE THE TOKEN (The Badge)
            localStorage.setItem("token", result.data.token);
            
            // 2. Save User Info for display
            localStorage.setItem("userId", result.data._id);
            localStorage.setItem("username", result.data.username);
            
            navigate('/'); // Go to Dashboard
        } else {
            alert("Login failed! Please check credentials.");
        }
    })
    .catch(err => {
        console.log(err);
        alert("Login Error: " + (err.response?.data?.message || err.message));
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>🔐 Login to PocketWise</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
          required
        />
        
        <input 
          type="password" 
          placeholder="Enter your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
          required
        />
        
        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>

      </form>
      
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;