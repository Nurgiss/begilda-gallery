import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ShopItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ShopDetailProps {
  shopItemId: number;
  shopItems: ShopItem[];
  onNavigate: (page: string, id?: number, type?: 'painting' | 'shop') => void;
  addToCart: (item: ShopItem, type: 'shop') => void;
  currency: 'USD'|'EUR'|'KZT';
  convertPrice?: (priceUSD: number) => number;
}

export function ShopDetail({ shopItemId, shopItems, onNavigate, addToCart, currency, convertPrice }: ShopDetailProps) {
  const shopItem = shopItems.find(item => item.id === shopItemId);

  if (!shopItem) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
        <p>Shop item not found</p>
        <button className="btn" onClick={() => onNavigate('shop')} style={{ marginTop: 'var(--spacing-md)' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => onNavigate('shop')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'translateY(1px)' }}>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Назад в магазин
          </button>
        </div>
        <div className="detail-grid" style={{ overflow: 'hidden' }}>
          <div>
            <ImageWithFallback
              src={shopItem.image}
              alt={shopItem.title}
              className="detail-image"
            />
          </div>

          <div className="detail-content">
            <h1 className="detail-title">{shopItem.title}</h1>
            {(() => {
              const baseUSD = shopItem.price || 0; // цена товара магазина в USD
              const value = convertPrice ? convertPrice(baseUSD) : baseUSD;
              const symbol = currency === 'EUR' ? '€' : currency === 'KZT' ? '₸' : '$';
              return (
                <p className="detail-price">
                  {symbol}{value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              );
            })()}

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Artist</span>
                <span className="meta-value">{shopItem.artist}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{shopItem.category}</span>
              </div>
            </div>

            <p className="detail-description">{shopItem.description}</p>

            <div className="detail-actions">
              <button
                className="btn"
                onClick={() => addToCart(shopItem, 'shop')}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('shop')}
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}