import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const handleProfileUpdate = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar user={currentUser} onLogout={handleLogout} unreadCount={unreadCount} />}
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
              <Route path="*" element={<Login onLogin={handleLogin} />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat currentUser={currentUser} onUnreadUpdate={setUnreadCount} />} />
              <Route path="/profile" element={<Profile currentUser={currentUser} onProfileUpdate={handleProfileUpdate} />} />
              <Route path="*" element={<Home />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
