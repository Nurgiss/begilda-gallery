import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AdminHeaderRouter } from '../components/AdminHeaderRouter';

const ADMIN_PREFIX = import.meta.env.VITE_ADMIN_PATH_PREFIX || 'admin';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('adminToken');
    } catch {
      return false;
    }
  });

  const isLoginPage = location.pathname === `/${ADMIN_PREFIX}/login`;

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
    navigate(`/${ADMIN_PREFIX}/login`);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate(`/${ADMIN_PREFIX}/paintings`);
  };

  // Redirect to login if not authenticated (except on login page)
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to={`/${ADMIN_PREFIX}/login`} replace />;
  }

  // Redirect to paintings if authenticated and on login page
  if (isAuthenticated && isLoginPage) {
    return <Navigate to={`/${ADMIN_PREFIX}/paintings`} replace />;
  }

  return (
    <div className="app-wrapper">
      {!isLoginPage && (
        <AdminHeaderRouter onLogout={handleLogout} />
      )}
      <main className="main-content">
        <Outlet context={{ onLogin: handleLogin }} />
      </main>
    </div>
  );
}
