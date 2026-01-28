import { ShoppingCart, DollarSign, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import logo from '../../assets/images/logo.png';

export function Header() {
  const location = useLocation();
  const { cart, currency, setCurrency } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pathname = location.pathname;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowCurrencyMenu(false);
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src={logo} alt="Begilda Gallery Logo" />
          </Link>
          <nav className="nav">
            <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/exhibitions" className={`nav-link ${isActive('/exhibitions') ? 'active' : ''}`}>Exhibitions</Link>
            <Link to="/artists" className={`nav-link ${isActive('/artists') ? 'active' : ''}`}>Artists</Link>
            <Link to="/news" className={`nav-link ${isActive('/news') ? 'active' : ''}`}>News</Link>
            <Link to="/catalog" className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}>Catalog</Link>
            <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>Shop</Link>
            <Link to="/cart" className="nav-link cart-link" style={{ position: 'relative' }}>
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            <div ref={menuRef} className="currency-group">
              <button className="currency-btn" onClick={() => setShowCurrencyMenu(!showCurrencyMenu)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <DollarSign size={18} /> <span className="currency-label">{currency}</span>
              </button>
              <button className="currency-chevron" onClick={() => setShowCurrencyMenu(!showCurrencyMenu)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <ChevronDown size={16} />
              </button>
              {showCurrencyMenu && (
                <div className="currency-menu">
                  {(['USD','EUR','KZT'] as const).map((c) => (
                    <button key={c} className={`currency-option ${c === currency ? 'active' : ''}`} onClick={() => { setCurrency(c); setShowCurrencyMenu(false); }}>{c}</button>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? '✕' : '☰'}</button>
        </div>
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/exhibitions" className={`mobile-nav-link ${isActive('/exhibitions') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Exhibitions</Link>
            <Link to="/artists" className={`mobile-nav-link ${isActive('/artists') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Artists</Link>
            <Link to="/news" className={`mobile-nav-link ${isActive('/news') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>News</Link>
            <Link to="/catalog" className={`mobile-nav-link ${isActive('/catalog') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Catalog</Link>
            <Link to="/shop" className={`mobile-nav-link ${isActive('/shop') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/cart" className="mobile-nav-link cart-link" onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'relative' }}>
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
