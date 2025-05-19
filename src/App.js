import React, { useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { AuthContext } from './components/Auth/AuthContext';
import Dashboard from './components/Dashboard/Dashboard';
import ModuleList from './components/CourseTracking/ModuleList';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

// Top Header Component
const TopHeader = ({ currentUser, logout }) => {
  return (
    <div className="top-header">
      <Link to="/" className="logo">
        <span className="logo-icon">📊</span>
        <span>Devolve</span>
      </Link>
      
      <button 
        className="logout-button" 
        onClick={logout}
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
};

// Bottom Navigation Component
const BottomNavigation = ({ currentUser }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  
  // Modified for HashRouter compatibility
  const location = window.location.hash.replace('#', '') || '/';
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };
  
  return (
    <>
      {/* Backdrop for user menu */}
      <div 
        className={`backdrop ${userMenuOpen ? 'open' : ''}`}
        onClick={closeUserMenu}
      ></div>
      
      {/* User Menu */}
      <div className={`user-menu ${userMenuOpen ? 'open' : ''}`}>
        <div className="user-menu-header">
          <div className="user-menu-avatar">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-menu-info">
            <h3 className="user-menu-name">{currentUser?.name || 'User'}</h3>
            <p className="user-menu-email">{currentUser?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <div className="user-menu-actions">
          <button 
            className="logout-button" 
            onClick={handleLogout}
            style={{ width: '100%' }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Fixed Bottom Navigation */}
      <div className="navigation-container">
        <div className="nav-bar">
          <Link to="/" className={`nav-item ${location === '/' ? 'active' : ''}`}>
            <span className="nav-icon">📈</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          
          <Link to="/modules" className={`nav-item ${location === '/modules' ? 'active' : ''}`}>
            <span className="nav-icon">📚</span>
            <span className="nav-text">Modules</span>
          </Link>
          
          <button className="user-button" onClick={toggleUserMenu}>
            <div className="user-avatar">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <span className="nav-text">Profile</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, logout } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        color: '#e0e0e0'
      }}>
        <div 
          style={{
            border: '4px solid #3c3c3c',
            borderTop: '4px solid #4d9aff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            marginRight: '10px'
          }}
        />
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      <TopHeader currentUser={currentUser} logout={logout} />
      <div className="app-container" style={{ backgroundColor: '#1e1e1e' }}>
        {children}
      </div>
      <BottomNavigation currentUser={currentUser} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProgressProvider>
          <div className="App" style={{
            backgroundColor: '#1e1e1e',
            minHeight: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
          }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/modules" element={
                <ProtectedRoute>
                  <ModuleList />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </ProgressProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;