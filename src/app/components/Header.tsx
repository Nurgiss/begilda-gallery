import { ShoppingCart, DollarSign, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cart: Array<{item: any, type: 'painting' | 'shop', quantity: number}>;
  currency?: 'USD' | 'EUR' | 'KZT';
  onCurrencyChange?: (c: 'USD'|'EUR'|'KZT') => void;
}

export function Header({ currentPage, onNavigate, cart, currency = 'USD', onCurrencyChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCurrencyMenu(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <a 
            className="logo" 
            onClick={() => onNavigate('home')}
            style={{ cursor: 'pointer' }}
          >
            BEGILDA GALLERY
          </a>
          
          <nav className="nav">
            <a 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              Home
            </a>
            <a 
              className={`nav-link ${currentPage === 'exhibitions' || currentPage === 'exhibition-detail' ? 'active' : ''}`}
              onClick={() => onNavigate('exhibitions')}
            >
              Exhibitions
            </a>
            <a 
              className={`nav-link ${currentPage === 'artists' || currentPage === 'artist-detail' ? 'active' : ''}`}
              onClick={() => onNavigate('artists')}
            >
              Artists
            </a>
            <a 
              className={`nav-link ${currentPage === 'news' || currentPage === 'news-detail' ? 'active' : ''}`}
              onClick={() => onNavigate('news')}
            >
              News
            </a>
            <a 
              className={`nav-link ${currentPage === 'catalog' ? 'active' : ''}`}
              onClick={() => onNavigate('catalog')}
            >
              Catalog
            </a>
            <a 
              className={`nav-link ${currentPage === 'shop' || currentPage === 'shop-detail' ? 'active' : ''}`}
              onClick={() => onNavigate('shop')}
            >
              Shop
            </a>
            <a 
              className="nav-link admin-link"
              onClick={() => onNavigate('admin-paintings')}
            >
              Admin
            </a>
            <a 
              className="nav-link cart-link"
              onClick={() => onNavigate('cart')}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </a>

            <div ref={menuRef} className="currency-group">
              <button
                className="currency-btn"
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                title="Change currency"
                aria-expanded={showCurrencyMenu}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <DollarSign size={18} /> <span className="currency-label">{currency}</span>
              </button>

              <button
                className="currency-chevron"
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                aria-label="Open currency menu"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <ChevronDown size={16} />
              </button>

              {showCurrencyMenu && (
                <div className="currency-menu">
                  {(['USD','EUR','KZT'] as const).map((c) => (
                    <button
                      key={c}
                      className={`currency-option ${c === currency ? 'active' : ''}`}
                      onClick={() => { onCurrencyChange && onCurrencyChange(c); setShowCurrencyMenu(false); }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <a 
              className={`mobile-nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
            >
              Home
            </a>
            <a 
              className={`mobile-nav-link ${currentPage === 'exhibitions' || currentPage === 'exhibition-detail' ? 'active' : ''}`}
              onClick={() => { onNavigate('exhibitions'); setIsMobileMenuOpen(false); }}
            >
              Exhibitions
            </a>
            <a 
              className={`mobile-nav-link ${currentPage === 'artists' || currentPage === 'artist-detail' ? 'active' : ''}`}
              onClick={() => { onNavigate('artists'); setIsMobileMenuOpen(false); }}
            >
              Artists
            </a>
            <a 
              className={`mobile-nav-link ${currentPage === 'news' || currentPage === 'news-detail' ? 'active' : ''}`}
              onClick={() => { onNavigate('news'); setIsMobileMenuOpen(false); }}
            >
              News
            </a>
            <a 
              className={`mobile-nav-link ${currentPage === 'catalog' ? 'active' : ''}`}
              onClick={() => { onNavigate('catalog'); setIsMobileMenuOpen(false); }}
            >
              Catalog
            </a>
            <a 
              className={`mobile-nav-link ${currentPage === 'shop' || currentPage === 'shop-detail' ? 'active' : ''}`}
              onClick={() => { onNavigate('shop'); setIsMobileMenuOpen(false); }}
            >
              Shop
            </a>
            <a 
              className="mobile-nav-link admin-link"
              onClick={() => { onNavigate('admin-paintings'); setIsMobileMenuOpen(false); }}
            >
              Admin
            </a>
            <a 
              className="mobile-nav-link cart-link"
              onClick={() => { onNavigate('cart'); setIsMobileMenuOpen(false); }}
              style={{ position: 'relative' }}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}