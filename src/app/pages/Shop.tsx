import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ShopItem } from '../../types';
import { getShopItems } from '../../api/client';
import { useAppContext } from '../context/AppContext';

const categoryLabels: Record<string, string> = {
  all: 'ALL',
  Prints: 'PRINTS',
  Posters: 'POSTERS',
  Books: 'BOOKS',
  Postcards: 'POSTCARDS',
  Gifts: 'GIFTS',
};

export function Shop() {
  const { addToCart, currency, convertPrice } = useAppContext();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    getShopItems()
      .then(data => setItems(data))
      .catch(console.error);
  }, []);

  const filteredItems = selectedCategory === 'all' ? items : items.filter(item => item.category === selectedCategory);

  return (
    <div className="shop-page-white">
      <section className="shop-section-white">
        <div className="container-wide">
          <h1 className="page-title-white">Shop</h1>

          <div className="shop-filters-white">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                className={`filter-btn-white ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="shop-grid-white">
            {filteredItems.map((item) => {
              const value = convertPrice ? convertPrice(item.price || 0) : item.price || 0;
              const symbol = currency === 'EUR' ? '€' : currency === 'KZT' ? '₸' : '$';
              return (
                <Link key={item.id} to={`/shop/${item.id}`} className="shop-card-white" style={{ position: 'relative', opacity: item.availability === false ? 0.75 : 1 }}>
                  {item.availability === false && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#c33',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      zIndex: 2,
                      textTransform: 'uppercase',
                    }}>SOLD</div>
                  )}
                  <div className="shop-image-wrapper-white">
                    <ImageWithFallback src={item.image} alt={item.title} className="shop-image-white" />
                  </div>
                  <div className="shop-info-white">
                    <h3 className="shop-title-white">{item.title}</h3>
                    <p className="shop-price-white">{symbol}{value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                    {item.availability !== false ? (
                      <button
                        className="btn"
                        onClick={(e) => { e.preventDefault(); addToCart(item, 'shop'); }}
                        style={{ marginTop: '10px', fontSize: '12px', padding: '8px 16px' }}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        className="btn"
                        disabled
                        onClick={(e) => e.preventDefault()}
                        style={{ marginTop: '10px', fontSize: '12px', padding: '8px 16px', opacity: 0.5, cursor: 'not-allowed' }}
                      >
                        Sold Out
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
