import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Teacher CMS
        </Link>
        
        {isAuthenticated && (
          <ul className="navbar-menu">
            <li>
              <span style={{ marginRight: '10px' }}>
                {user?.name} ({user?.role})
              </span>
            </li>
            <li>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
