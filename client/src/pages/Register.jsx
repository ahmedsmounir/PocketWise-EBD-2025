import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. IMPORT AXIOS

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [allowance, setAllowance] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 2. PREPARE THE DATA
    // We map 'allowance' to 'monthlyAllowance' to match your Database Schema
    const userData = {
        username: username,
        email: email,
        password: password,
        monthlyAllowance: allowance 
    };

    // 3. SEND TO SERVER (Using the correct /api/auth URL)
    axios.post('http://localhost:5000/api/auth/register', userData)
        .then(result => {
            console.log(result);
            // Only redirect if the server says "OK"
            alert(`Welcome ${username}! Your account has been created.`);
            navigate('/login'); 
        })
        .catch(err => {
            console.log(err);
            // Show a helpful error if it fails
            if (err.response && err.response.data) {
                alert("Error: " + err.response.data.message);
            } else {
                alert("Registration failed. Please try again.");
            }
        });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>📝 Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)}
          required // Added 'required' to prevent empty submissions
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input 
          type="email" 
          placeholder="Email Address" 
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <label style={{textAlign: 'left', fontWeight: 'bold'}}>Monthly Allowance (EGP):</label>
        <input 
          type="number" 
          placeholder="e.g. 3000" 
          onChange={(e) => setAllowance(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
          Create Account
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;