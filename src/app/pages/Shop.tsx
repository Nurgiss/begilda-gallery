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
    getShopItems().then(setItems).catch(console.error);
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
                <Link key={item.id} to={`/shop/${item.id}`} className="shop-card-white">
                  <div className="shop-image-wrapper-white">
                    <ImageWithFallback src={item.image} alt={item.title} className="shop-image-white" />
                  </div>
                  <div className="shop-info-white">
                    <h3 className="shop-title-white">{item.title}</h3>
                    <p className="shop-price-white">{symbol}{value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                    <button
                      className="btn"
                      onClick={(e) => { e.preventDefault(); addToCart(item, 'shop'); }}
                      style={{ marginTop: '10px', fontSize: '12px', padding: '8px 16px' }}
                    >
                      Add to Cart
                    </button>
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
