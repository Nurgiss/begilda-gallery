interface AdminHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function AdminHeader({ currentPage, onNavigate, onLogout }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="container">
        <div className="header-content">
          <a 
            className="logo" 
            onClick={() => onNavigate('admin-paintings')}
            style={{ cursor: 'pointer' }}
          >
            Admin Panel
          </a>
          
          <nav className="nav">
            <a 
              className={`nav-link ${currentPage === 'admin-paintings' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-paintings')}
            >
              Paintings
            </a>
            <a 
              className={`nav-link ${currentPage === 'admin-orders' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-orders')}
            >
              Orders
            </a>
            <a 
              className={`nav-link ${currentPage === 'admin-news' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-news')}
            >
              News
            </a>
            <a 
              className={`nav-link ${currentPage === 'admin-exhibitions' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-exhibitions')}
            >
              Exhibitions
            </a>
            <a 
              className={`nav-link ${currentPage === 'admin-artists' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-artists')}
            >
              Artists
            </a>
            <a 
              className={`nav-link ${currentPage === 'admin-shop' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-shop')}
            >
              Shop
            </a>
            <a 
              className={`nav-link ${currentPage === 'admin-currency' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-currency')}
              style={{ color: '#ffc107' }}
            >
              💱 Currency
            </a>
            <a 
              className="nav-link"
              onClick={() => onNavigate('home')}
            >
              ← Back to Site
            </a>
            {onLogout && (
              <button
                className="nav-link"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={async () => {
                  try {
                    const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8001/api';
                    const token = localStorage.getItem('adminToken');
                    if (token) {
                      await fetch(`${apiBase}/logout`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                    }
                  } catch (e) {}
                  try { localStorage.removeItem('adminToken'); } catch (e) {}
                  onLogout();
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}