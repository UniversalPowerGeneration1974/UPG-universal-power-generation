import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 
import logo from '../assets/unnamed.png'; 

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const getInitials = () => {
    return (user?.fullname || user?.username || 'U').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          
          <h1><img src={logo} alt="UPG Logo" className="logo-img" /> UPG</h1>
          <p>Universal Power Generation</p>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/chat" className="chat-link">
              Chat
            </Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li className="profile-pic-item">
            <Link to="/profile" className="profile-pic-link">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="navbar-avatar" />
              ) : (
                <div className="navbar-avatar-initials">{getInitials()}</div>
              )}
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
