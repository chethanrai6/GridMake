import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiLayers, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Don't show header on auth pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/dashboard" className="header-brand" aria-label="Go to dashboard">
            <span className="header-logo" aria-hidden="true">
              <FiLayers />
            </span>
            <span className="header-title">Drawing Grid Maker</span>
          </Link>

          <nav className="header-nav">
            <span className="header-user" title={user.name}>Welcome, {user.name}</span>
            <div className="header-actions">
              <Link to="/dashboard" className="btn btn-outline btn-icon">
                <FiGrid aria-hidden="true" />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-icon">
                <FiLogOut aria-hidden="true" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;