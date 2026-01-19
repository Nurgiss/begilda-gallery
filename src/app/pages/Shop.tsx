import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ShopItem {
  id: string | number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  artist?: string;
}

interface ShopProps {
  items: ShopItem[];
  onNavigate: (page: string, id?: string | number, type?: 'painting' | 'shop') => void;
  addToCart: (item: ShopItem, type: 'shop') => void;
  currency: 'USD'|'EUR'|'KZT';
  convertPrice?: (priceUSD: number) => number;
}

export function Shop({ items, onNavigate, addToCart, currency, convertPrice }: ShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="shop-page-white">
      <section className="shop-section-white">
        <div className="container-wide">
          <h1 className="page-title-white">Shop</h1>
          
          <div className="shop-filters-white">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn-white ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>

          <div className="shop-grid-white">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="shop-card-white"
                onClick={() => onNavigate('shop-detail', item.id)}
              >
                <div className="shop-image-wrapper-white">
                  <ImageWithFallback 
                    src={item.image} 
                    alt={item.title}
                    className="shop-image-white"
                  />
                </div>
                <div className="shop-info-white">
                  <h3 className="shop-title-white">{item.title}</h3>
                  {/* Товары в магазине могут не иметь артиста */}
                  {(() => {
                    const baseUSD = item.price || 0; // товары магазина хранят цену в USD
                    const value = convertPrice ? convertPrice(baseUSD) : baseUSD;
                    const symbol = currency === 'EUR' ? '€' : currency === 'KZT' ? '₸' : '$';
                    return (
                      <p className="shop-price-white">
                        {symbol}{value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </p>
                    );
                  })()}
                  <button 
                    className="btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item, 'shop');
                    }}
                    style={{ marginTop: '10px', fontSize: '12px', padding: '8px 16px' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}