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

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 60px)',
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
  
  return children;
};

// Modern Navigation component with responsive design
const Navigation = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Modified for HashRouter compatibility
  const location = window.location.hash.replace('#', '') || '/';
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will happen automatically due to protected routes
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  return (
    <header className="modern-header">
      <div className="header-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        height: '100%',
        flexDirection: isMobile ? 'row' : 'row',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: isMobile ? '5px' : '0'
      }}>
        {/* Left section - Logo */}
        <div className="logo-section">
          <Link to="/" className="logo" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#ffffff'
          }}>
            <span className="logo-icon" style={{ fontSize: '1.5rem', marginRight: '8px' }}>📊</span>
            <span className="logo-text" style={{ 
              fontSize: isMobile ? '1.2rem' : '1.5rem', 
              fontWeight: '600',
              display: isMobile ? 'none' : 'inline'
            }}>BootcampTracker</span>
          </Link>
        </div>
        
        {/* Center section - Navigation */}
        <nav className="main-nav" style={{
          display: 'flex',
          gap: '10px',
          width: isMobile ? '100%' : 'auto',
          justifyContent: 'center',
          order: isMobile ? 3 : 'unset',
          marginTop: isMobile ? '8px' : '0',
          flex: '1',
          justifyContent: 'center'
        }}>
          <Link to="/" className={`nav-item ${location === '/' ? 'active' : ''}`} style={{
            display: 'flex',
            alignItems: 'center',
            padding: isMobile ? '8px 12px' : '10px 15px',
            backgroundColor: location === '/' ? '#4d9aff20' : 'transparent',
            border: location === '/' ? '1px solid #4d9aff' : '1px solid #4f4f4f',
            borderRadius: '6px',
            textDecoration: 'none',
            color: location === '/' ? '#4d9aff' : '#b3b3b3',
            transition: 'all 0.2s ease',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            <span className="nav-icon" style={{ marginRight: isMobile ? '0' : '5px' }}>📈</span>
            <span className="nav-text" style={{ display: isMobile ? 'none' : 'inline' }}>Dashboard</span>
          </Link>
          <Link to="/modules" className={`nav-item ${location === '/modules' ? 'active' : ''}`} style={{
            display: 'flex',
            alignItems: 'center',
            padding: isMobile ? '8px 12px' : '10px 15px',
            backgroundColor: location === '/modules' ? '#4d9aff20' : 'transparent',
            border: location === '/modules' ? '1px solid #4d9aff' : '1px solid #4f4f4f',
            borderRadius: '6px',
            textDecoration: 'none',
            color: location === '/modules' ? '#4d9aff' : '#b3b3b3',
            transition: 'all 0.2s ease',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            <span className="nav-icon" style={{ marginRight: isMobile ? '0' : '5px' }}>📚</span>
            <span className="nav-text" style={{ display: isMobile ? 'none' : 'inline' }}>Modules</span>
          </Link>
        </nav>
        
        {/* Right section - User profile and logout */}
        <div className="user-section" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <div className="user-profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div className="user-avatar" style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#4d9aff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: '600'
            }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <span className="user-name" style={{
              color: '#e0e0e0',
              fontSize: isMobile ? '0.9rem' : '1rem',
              display: isMobile ? 'none' : 'inline'
            }}>Hi, {currentUser?.name || 'User'}</span>
          </div>
          <button 
            className="logout-button" 
            onClick={handleLogout} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: isMobile ? '6px' : '8px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #ff6b6b',
              borderRadius: '6px',
              color: '#ff6b6b',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: isMobile ? '0.85rem' : '0.9rem'
            }}
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text" style={{
              display: isMobile ? 'none' : 'inline'
            }}>Logout</span>
          </button>
        </div>
      </div>
    </header>
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
                  <Navigation />
                  <div style={{ backgroundColor: '#1e1e1e', width: '100%' }}>
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/modules" element={
                <ProtectedRoute>
                  <Navigation />
                  <div style={{ backgroundColor: '#1e1e1e', width: '100%' }}>
                    <ModuleList />
                  </div>
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