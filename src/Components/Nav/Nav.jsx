import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Nav = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">Avida Creates</Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink></li>
          {isAuthenticated && (
            <li><NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink></li>
          )}
          {isAuthenticated ? (
            <>
              <li className="navbar-user">
                {user?.username}
                {isAdmin && <span className="badge badge-primary">Admin</span>}
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink></li>
              <li><NavLink to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
