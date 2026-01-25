import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { HeaderDark } from '../components/HeaderDark';
import { Footer } from '../components/Footer';
import { AppProvider } from '../context/AppContext';
import { CartItem, Currency, CurrencyRates } from '../../types';

export function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [currency, setCurrency] = useState<Currency>('USD');
  const [rates, setRates] = useState<CurrencyRates>({ EUR: 0.92, KZT: 480 });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter((e: CartItem) => e?.item?.id !== undefined) : [];
    } catch { return []; }
  });

  useEffect(() => { try { localStorage.setItem('cart', JSON.stringify(cart)); } catch {} }, [cart]);

  useEffect(() => {
    let mounted = true;
    import('../../api/currency').then(({ getCurrencyRates }) => {
      getCurrencyRates().then(r => { if (mounted) setRates({ EUR: r.usd / r.eur, KZT: r.usd }); }).catch(() => {});
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const convertPrice = (priceUSD: number) => currency === 'EUR' ? priceUSD * rates.EUR : currency === 'KZT' ? priceUSD * rates.KZT : priceUSD;

  const addToCart = (item: CartItem['item'], type: 'painting' | 'shop') => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id && c.type === type);
      return existing ? prev.map(c => c.item.id === item.id && c.type === type ? { ...c, quantity: c.quantity + 1 } : c) : [...prev, { item, type, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string | number, type: 'painting' | 'shop', qty: number) => {
    if (qty <= 0) { removeFromCart(itemId, type); return; }
    setCart(prev => prev.map(c => c.item.id === itemId && c.type === type ? { ...c, quantity: qty } : c));
  };

  const removeFromCart = (itemId: string | number, type: 'painting' | 'shop') => setCart(prev => prev.filter(c => !(c.item.id === itemId && c.type === type)));
  const clearCart = () => setCart([]);

  return (
    <AppProvider value={{ cart, currency, rates, setCurrency, convertPrice, addToCart, updateQuantity, removeFromCart, clearCart }}>
      <div className="app-wrapper">
        {isHome ? <Header /> : <HeaderDark />}
        <main className="main-content"><Outlet /></main>
        <Footer />
      </div>
    </AppProvider>
  );
}
