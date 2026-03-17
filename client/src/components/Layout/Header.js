import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiLayers, FiLogOut, FiLogIn, FiUserPlus, FiBookOpen } from 'react-icons/fi';
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

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isHomePage = location.pathname === '/';

  // On auth pages, show brand-only header
  if (isAuthPage) {
    return (
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="header-brand" aria-label="Home">
              <span className="header-logo" aria-hidden="true"><FiLayers /></span>
              <span className="header-title">Drawing Grid Maker</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // On home page (public), show brand + blog + login/signup nav
  if (isHomePage || !user) {
    return (
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="header-brand" aria-label="Home">
              <span className="header-logo" aria-hidden="true"><FiLayers /></span>
              <span className="header-title">Drawing Grid Maker</span>
            </Link>
            <nav className="header-nav">
              <Link to="/blog" className="btn btn-outline btn-icon">
                <FiBookOpen aria-hidden="true" /> Blog
              </Link>
              <div className="header-actions">
                <Link to="/login" className="btn btn-outline btn-icon">
                  <FiLogIn aria-hidden="true" /> Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-icon" style={{ color: '#fff' }}>
                  <FiUserPlus aria-hidden="true" /> Sign Up
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
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
            <Link to="/blog" className="btn btn-outline btn-icon">
              <FiBookOpen aria-hidden="true" /> Blog
            </Link>
            <span className="header-user" title={user.name}>Welcome, {user.name}</span>
            <div className="header-actions">
              <Link to="/dashboard" className="btn btn-outline btn-icon">
                <FiGrid aria-hidden="true" />
                Dashboard
              </Link>
              <Link to="/blog/new" className="btn btn-secondary btn-icon">
                <FiBookOpen aria-hidden="true" />
                Write
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