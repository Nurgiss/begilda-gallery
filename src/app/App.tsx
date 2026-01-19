import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeaderDark } from './components/HeaderDark';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Exhibitions } from './pages/Exhibitions';
import { ExhibitionDetail } from './pages/ExhibitionDetail';
import { Artists } from './pages/Artists';
import { Shop } from './pages/Shop';
import { ShopDetail } from './pages/ShopDetail';
import { Catalog } from './pages/Catalog';
import { PaintingDetail } from './pages/PaintingDetail';
import { Checkout } from './pages/Checkout';
import { NewsList } from './components/NewsList';
import { NewsDetail } from './components/NewsDetail';
import { getPaintings, getExhibitions, getNews, getShopItems } from '../api/client';
import {
  Page,
  News,
  Exhibition,
  Artist,
  ShopItem,
  Artwork,
  CartItem,
  Currency,
  CurrencyRates,
} from '../types';
import '../styles/index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [rates, setRates] = useState<CurrencyRates>({ EUR: 0.92, KZT: 480 });
  const [selectedPaintingId, setSelectedPaintingId] = useState<string | number | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | number | null>(null);
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string | number | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | number | null>(null);
  const [selectedShopItemId, setSelectedShopItemId] = useState<string | number | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      // Фильтруем битые элементы, у которых нет item или id
      return parsed.filter((entry) => entry && entry.item && typeof entry.item.id !== 'undefined');
    } catch (e) {
      return [];
    }
  });
  
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exhibitionsData, newsData, shopData] = await Promise.all([
          getExhibitions(),
          getNews(),
          getShopItems()
        ]);
        setExhibitions(exhibitionsData);
        setNews(newsData);
        setShopItems(shopData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    loadData();
  }, []);

  const [shopItems, setShopItems] = useState<ShopItem[]>([
   
  ]);
  
  const [news, setNews] = useState<News[]>([
   
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      // ignore persistence errors
    }
  }, [cart]);

  const handleNavigate = (page: string, id?: string | number, type?: 'painting' | 'shop') => {
    setCurrentPage(page as Page);
    if (page === 'detail' && id) {
      setSelectedPaintingId(id);
    }
    if (page === 'news-detail' && id) {
      setSelectedNewsId(id);
    }
    if (page === 'exhibition-detail' && id) {
      setSelectedExhibitionId(id);
    }
    if (page === 'artist-detail' && id) {
      setSelectedArtistId(id);
    }
    if (page === 'shop-detail' && id) {
      setSelectedShopItemId(id);
    }
    if (page === 'shop') {
      setSelectedShopItemId(null);
    }
    if (page === 'checkout' && id) {
      if (type === 'shop') {
        setSelectedShopItemId(id);
        setSelectedPaintingId(null);
      } else {
        setSelectedPaintingId(id);
        setSelectedShopItemId(null);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const addToCart = (item: any, type: 'painting' | 'shop') => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id && cartItem.type === type);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id && cartItem.type === type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, type, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId: string | number, type: 'painting' | 'shop', newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, type);
      return;
    }
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.item.id === itemId && cartItem.type === type
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  };

  const removeFromCart = (itemId: string | number, type: 'painting' | 'shop') => {
    setCart(prevCart => prevCart.filter(cartItem => !(cartItem.item.id === itemId && cartItem.type === type)));
  };
  
  const clearCart = () => {
    setCart([]);
  };

  // Загружаем актуальные курсы из сервиса currency.ts (USD -> EUR, USD -> KZT)
  useEffect(() => {
    let isMounted = true;
    import('../api/currency').then(({ getCurrencyRates }) => {
      getCurrencyRates()
        .then(r => {
          if (!isMounted) return;
          // r.usd - KZT за 1 USD, r.eur - KZT за 1 EUR
          const usdToKzt = r.usd;
          const usdToEur = r.usd / r.eur;
          setRates({ EUR: usdToEur, KZT: usdToKzt });
        })
        .catch(() => {
          // оставляем дефолтные значения
        });
    }).catch(() => {
      // если модуль недоступен, просто используем дефолтные курсы
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const convertPrice = (priceUSD: number) => {
    if (currency === 'USD') return priceUSD;
    if (currency === 'EUR') return +(priceUSD * rates.EUR);
    if (currency === 'KZT') return +(priceUSD * rates.KZT);
    return priceUSD;
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
      case 'contact':
        return <Home onNavigate={handleNavigate} news={news} exhibitions={exhibitions} currency={currency} convertPrice={convertPrice} />;
      case 'exhibitions':
        return <Exhibitions exhibitions={exhibitions} onNavigate={handleNavigate} />;
      case 'exhibition-detail':
        return (
          <ExhibitionDetail
            exhibition={exhibitions.find(e => e.id === selectedExhibitionId)}
            onNavigate={handleNavigate} 
          />
        );
      case 'artists':
        return <Artists exhibitions={exhibitions} onNavigate={handleNavigate} />;
      case 'artist-detail':
        return selectedArtistId ? (
          <Artists 
            exhibitions={exhibitions}
            selectedArtistId={selectedArtistId}
            onNavigate={handleNavigate} 
            addToCart={addToCart}
          />
        ) : (
          <Artists exhibitions={exhibitions} onNavigate={handleNavigate} />
        );
      case 'shop':
        return <Shop items={shopItems} onNavigate={handleNavigate} addToCart={addToCart} currency={currency} convertPrice={convertPrice} />;
      case 'shop-detail':
        return selectedShopItemId ? (
          <ShopDetail 
            shopItemId={selectedShopItemId} 
            shopItems={shopItems} 
            onNavigate={handleNavigate}
            addToCart={addToCart}
            currency={currency}
            convertPrice={convertPrice}
          />
        ) : (
          <Shop items={shopItems} onNavigate={handleNavigate} addToCart={addToCart} currency={currency} convertPrice={convertPrice} />
        );
      case 'catalog':
        return <Catalog onPaintingClick={(id) => handleNavigate('detail', id)} currency={currency} convertPrice={convertPrice} />;
      case 'detail':
        return selectedPaintingId ? (
          <PaintingDetail paintingId={selectedPaintingId} onNavigate={handleNavigate} addToCart={addToCart} currency={currency} convertPrice={convertPrice} />
        ) : (
          <Catalog onPaintingClick={(id) => handleNavigate('detail', id)} currency={currency} convertPrice={convertPrice} />
        );
      case 'checkout':
        return <Checkout cart={cart} onNavigate={handleNavigate} clearCart={clearCart} />;
      case 'cart':
        return (
          <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
            <h1 className="page-title">Shopping Cart</h1>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty.</p>
                <button className="btn" onClick={() => handleNavigate('shop')}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart
                    .filter((cartItem) => cartItem && cartItem.item)
                    .map((cartItem) => (
                    <div key={`${cartItem.item.id}-${cartItem.type}`} className="cart-item">
                      <img 
                        src={cartItem.item.image || cartItem.item.imageUrl} 
                        alt={cartItem.item.title} 
                        className="cart-item-image" 
                      />
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{cartItem.item.title}</h3>
                        {cartItem.item.artist && (
                          <p className="cart-item-artist">{cartItem.item.artist}</p>
                        )}
                        <p className="cart-item-price">
                          ${
                            (cartItem.item.priceUSD || cartItem.item.price || 0)
                              .toLocaleString('en-US')
                          }
                        </p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.type, cartItem.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="quantity-display">{cartItem.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.type, cartItem.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(cartItem.item.id, cartItem.type)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Total:</span>
                  <span>
                    ${cart
                      .filter((item) => item && item.item)
                      .reduce((sum, item) => {
                        const price = item.item.priceUSD || item.item.price || 0;
                        return sum + price * item.quantity;
                      }, 0)
                      .toLocaleString('en-US')}
                  </span>
                </div>
                <div className="cart-actions">
                  <button className="btn btn-secondary" onClick={() => handleNavigate('shop')}>
                    Continue Shopping
                  </button>
                  <button className="btn" onClick={() => handleNavigate('checkout')}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        );
      case 'news':
        return <NewsList news={news} onNavigate={handleNavigate} />;
      case 'news-detail':
        return <NewsDetail news={news.find(n => n.id === selectedNewsId)} onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} news={news} exhibitions={exhibitions} currency={currency} convertPrice={convertPrice} />;
    }
  };
  
  return (
    <div className="app-wrapper">
      {currentPage === 'home' ? (
        <Header currentPage={currentPage} onNavigate={handleNavigate} cart={cart} currency={currency} onCurrencyChange={setCurrency} />
      ) : (
        <HeaderDark currentPage={currentPage} onNavigate={handleNavigate} cart={cart} currency={currency} onCurrencyChange={setCurrency} />
      )}
      
      <main className="main-content">
        {renderPage()}
      </main>
      
      {<Footer onNavigate={handleNavigate} />}
    </div>
  );
}