import { useState, useEffect } from 'react';
import { AdminHeader } from './components/AdminHeader';
import AdminLogin from './pages/admin/AdminLogin';
import { PaintingsManager } from './pages/admin/PaintingsManager';
import { OrdersManager } from './pages/admin/OrdersManager';
import { NewsManager } from './pages/admin/NewsManager';
import { ExhibitionsManager } from './pages/admin/ExhibitionsManager';
import { ArtistsManager } from './pages/admin/ArtistsManager';
import { ShopManager } from './pages/admin/ShopManager';
import { CurrencySettings } from './pages/admin/CurrencySettings';
import { PickupPointsManager } from './pages/admin/PickupPointsManager';
import { Page } from '../types';

export default function AdminApp() {
  const [currentPage, setCurrentPage] = useState<Page>('admin-paintings');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try { return !!localStorage.getItem('adminToken'); } catch (e) { return false; }
  });

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
    setCurrentPage('admin-login');
  };

  // If not authenticated, show login
  if (!isAuthenticated && currentPage !== 'admin-login') {
    return (
      <AdminLogin
        onLogin={() => {
          setIsAuthenticated(true);
          handleNavigate('admin-paintings');
        }}
      />
    );
  }

  // If on login page but authenticated, go to paintings
  if (isAuthenticated && currentPage === 'admin-login') {
    setCurrentPage('admin-paintings');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'admin-paintings':
        return <PaintingsManager />;
      case 'admin-orders':
        return <OrdersManager />;
      case 'admin-news':
        return <NewsManager />;
      case 'admin-exhibitions':
        return <ExhibitionsManager />;
      case 'admin-artists':
        return <ArtistsManager />;
      case 'admin-shop':
        return <ShopManager />;
      case 'admin-currency':
        return <CurrencySettings />;
      case 'admin-pickup-points':
        return <PickupPointsManager />;
      case 'admin-login':
        return (
          <AdminLogin
            onLogin={() => {
              setIsAuthenticated(true);
              handleNavigate('admin-paintings');
            }}
          />
        );
      default:
        return <PaintingsManager />;
    }
  };

  return (
    <div className="app-wrapper">
      <AdminHeader 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
