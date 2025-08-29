import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/auth.js';
import { 
  Shield, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Trophy, 
  Target,
  BookOpen,
  Users,
  Home,
  Zap,
  Camera
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const user = await auth.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="brand">
          <Shield className="w-8 h-8 text-cyan-400" />
          <span className="text-xl font-bold text-white">Hackverse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          
          <Link 
            to="/labs" 
            className={`nav-link ${isActive('/labs') ? 'active' : ''}`}
          >
            <Target className="w-4 h-4" />
            Labs
          </Link>
          
          <Link 
            to="/challenges" 
            className={`nav-link ${isActive('/challenges') ? 'active' : ''}`}
          >
            <BookOpen className="w-4 h-4" />
            CTF
          </Link>
          
          <Link 
            to="/leaderboard" 
            className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Link>
          
          <Link 
            to="/community" 
            className={`nav-link ${isActive('/community') ? 'active' : ''}`}
          >
            <Users className="w-4 h-4" />
            Community
          </Link>
        </div>

        {/* User Section */}
        <div className="user-section">
          {isAuthenticated && currentUser ? (
            <div className="user-menu">
              {/* XP Display */}
              <div className="xp-display">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  {currentUser.xp?.toLocaleString() || 0} XP
                </span>
              </div>

              {/* User Profile */}
              <div className="profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="profile-button"
                >
                  <div className="user-avatar">
                    {currentUser.avatar || '👤'}
                  </div>
                  <span className="username">{currentUser.username}</span>
                  <span className="rank-badge">{currentUser.rank}</span>
                </button>

                {isProfileOpen && (
                  <div className="profile-menu">
                    <div className="profile-header">
                      <div className="profile-info">
                        <div className="user-avatar-large">
                          {currentUser.avatar || '👤'}
                        </div>
                        <div>
                          <div className="user-name">{currentUser.username}</div>
                          <div className="user-rank">{currentUser.rank}</div>
                          <div className="user-level">Level {currentUser.level}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="profile-stats">
                      <div className="stat">
                        <span className="stat-label">Labs Completed</span>
                        <span className="stat-value">{currentUser.totalLabsCompleted || 0}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Challenges Solved</span>
                        <span className="stat-value">{currentUser.totalChallengesSolved || 0}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Streak</span>
                        <span className="stat-value">{currentUser.streak || 0} days</span>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <Link to="/dashboard" className="profile-action">
                        <Home className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link to="/profile" className="profile-action">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link to="/settings" className="profile-action">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button onClick={handleLogout} className="profile-action logout">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-toggle"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link to="/labs" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            <Target className="w-4 h-4" />
            Labs
          </Link>
          <Link to="/challenges" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            <BookOpen className="w-4 h-4" />
            CTF
          </Link>
          <Link to="/leaderboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Link>
          <Link to="/community" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            <Users className="w-4 h-4" />
            Community
          </Link>
          
          {!isAuthenticated && (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
          
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="mobile-nav-link logout">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
