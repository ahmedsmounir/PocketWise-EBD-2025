import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/PocketWise_Logo.png'; 

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{ 
      background: 'white', 
      borderBottom: '1px solid #e5e7eb', 
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* 1. LEFT: Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Logo Container */}
          <div className="navbar-logo-container" style={{ position: 'relative', top: '4px' }}>
            <img 
              src={logoImg} 
              alt="PocketWise Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>

          <Link to="/" style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: '#111827', 
            textDecoration: 'none', 
            letterSpacing: '-0.5px',
            lineHeight: '1'
          }}>
            PocketWise
          </Link>
        </div>

        {/* 2. RIGHT: Dashboard Link + Logout Button */}
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          
          <Link to="/" style={{ 
            color: '#4b5563', 
            textDecoration: 'none', 
            fontWeight: '600', 
            fontSize: '16px',
            transition: 'color 0.2s'
          }}>
            Dashboard
          </Link>

          <button 
            onClick={handleLogout} 
            className="btn btn-danger" 
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            Log Out
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;