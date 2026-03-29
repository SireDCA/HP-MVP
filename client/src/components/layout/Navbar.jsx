import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'doctor': return '/provider';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏥</span>
          <span className="brand-text">Health<span className="brand-accent">Provida</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/hospitals" className="nav-link">Find Hospitals</Link>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              <div className="nav-user">
                <span className="nav-user-name">{user.name}</span>
                <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user.role}</span>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>

        {menuOpen && (
          <div className="navbar-mobile">
            <Link to="/hospitals" onClick={() => setMenuOpen(false)}>Find Hospitals</Link>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          height: 70px;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: var(--font-size-xl);
          font-weight: 800;
          color: var(--text-primary);
        }
        .brand-icon { font-size: 1.5rem; }
        .brand-accent { color: var(--primary-500); }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .nav-link:hover { color: var(--primary-500); }
        .nav-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .nav-user-name {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--text-primary);
        }
        .nav-auth { display: flex; align-items: center; gap: 0.5rem; }
        .navbar-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .navbar-hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
        }
        .navbar-mobile {
          display: none;
          position: absolute;
          top: 70px;
          left: 0;
          right: 0;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          padding: 1rem;
          box-shadow: var(--shadow-lg);
        }
        .navbar-mobile a, .navbar-mobile button {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: left;
          border: none;
          background: none;
          font-size: var(--font-size-sm);
          color: var(--text-primary);
          cursor: pointer;
          border-radius: var(--radius-sm);
        }
        .navbar-mobile a:hover, .navbar-mobile button:hover {
          background: var(--gray-100);
        }
        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .navbar-hamburger { display: flex; }
          .navbar-mobile { display: block; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
