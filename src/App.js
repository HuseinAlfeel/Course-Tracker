// Modified Navigation component for App.js

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
      <div className="header-container">
        {isMobile ? (
          <>
            {/* Mobile layout with top row and bottom nav */}
            <div className="top-row">
              {/* Left section - Logo */}
              <div className="logo-section">
                <Link to="/" className="logo">
                  <span className="logo-icon">📊</span>
                  <span className="logo-text">Devolve</span>
                </Link>
              </div>
              
              {/* Right section - User profile and logout */}
              <div className="user-section">
                <div className="user-profile">
                  <div className="user-avatar">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="user-name">Hi, {currentUser?.name || 'User'}</span>
                </div>
                <button 
                  className="logout-button" 
                  onClick={handleLogout}
                >
                  <span className="logout-icon">🚪</span>
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            </div>
            
            {/* Bottom nav for mobile */}
            <nav className="main-nav">
              <Link to="/" className={`nav-item ${location === '/' ? 'active' : ''}`}>
                <span className="nav-icon">📈</span>
                <span className="nav-text">Dashboard</span>
              </Link>
              <Link to="/modules" className={`nav-item ${location === '/modules' ? 'active' : ''}`}>
                <span className="nav-icon">📚</span>
                <span className="nav-text">Modules</span>
              </Link>
            </nav>
          </>
        ) : (
          <>
            {/* Desktop layout - all in one row */}
            {/* Left section - Logo */}
            <div className="logo-section">
              <Link to="/" className="logo">
                <span className="logo-icon">📊</span>
                <span className="logo-text">Devolve</span>
              </Link>
            </div>
            
            {/* Center section - Navigation */}
            <nav className="main-nav">
              <Link to="/" className={`nav-item ${location === '/' ? 'active' : ''}`}>
                <span className="nav-icon">📈</span>
                <span className="nav-text">Dashboard</span>
              </Link>
              <Link to="/modules" className={`nav-item ${location === '/modules' ? 'active' : ''}`}>
                <span className="nav-icon">📚</span>
                <span className="nav-text">Modules</span>
              </Link>
            </nav>
            
            {/* Right section - User profile and logout */}
            <div className="user-section">
              <div className="user-profile">
                <div className="user-avatar">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <span className="user-name">Hi, {currentUser?.name || 'User'}</span>
              </div>
              <button 
                className="logout-button" 
                onClick={handleLogout}
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};