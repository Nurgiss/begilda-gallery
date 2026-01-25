import { NavLink, Link } from 'react-router-dom';

const ADMIN_PREFIX = import.meta.env.VITE_ADMIN_PATH_PREFIX || 'admin';

interface AdminHeaderRouterProps {
  onLogout: () => void;
}

export function AdminHeaderRouter({ onLogout }: AdminHeaderRouterProps) {
  const handleLogout = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api';
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch(`${apiBase}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignore logout API errors
    }
    onLogout();
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        <Link to={`/${ADMIN_PREFIX}/paintings`} className="logo">
          Admin Panel
        </Link>

        <nav className="nav">
          <NavLink
            to={`/${ADMIN_PREFIX}/paintings`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Paintings
          </NavLink>
          <NavLink
            to={`/${ADMIN_PREFIX}/orders`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Orders
          </NavLink>
          <NavLink
            to={`/${ADMIN_PREFIX}/news`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            News
          </NavLink>
          <NavLink
            to={`/${ADMIN_PREFIX}/exhibitions`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Exhibitions
          </NavLink>
          <NavLink
            to={`/${ADMIN_PREFIX}/artists`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Artists
          </NavLink>
          <NavLink
            to={`/${ADMIN_PREFIX}/shop`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Shop
          </NavLink>
          <NavLink
            to={`/${ADMIN_PREFIX}/pickup-points`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Pickup Points
          </NavLink>
          <NavLink
            to={`/${ADMIN_PREFIX}/currency`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ color: '#ffc107' }}
          >
            Currency
          </NavLink>
          <Link to="/" className="nav-link">
            ← Back to Site
          </Link>
          <button
            className="nav-link"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
