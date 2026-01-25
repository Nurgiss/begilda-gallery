import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ShopItem } from '../../types';
import { getShopItems } from '../../api/client';
import { useAppContext } from '../context/AppContext';

export function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, currency, convertPrice } = useAppContext();
  const [shopItem, setShopItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShopItems()
      .then(items => setShopItem(items.find((i: ShopItem) => String(i.id) === id) || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container-wide" style={{ padding: 'var(--spacing-xl) 0' }}><p>Loading...</p></div>;

  if (!shopItem) {
    return (
      <div className="container-wide" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
        <p>Shop item not found</p>
        <Link to="/shop" className="btn" style={{ marginTop: 'var(--spacing-md)' }}>Back to Shop</Link>
      </div>
    );
  }

  const value = convertPrice ? convertPrice(shopItem.price || 0) : shopItem.price || 0;
  const symbol = currency === 'EUR' ? '€' : currency === 'KZT' ? '₸' : '$';

  return (
    <div className="detail-page">
      <div className="container-wide">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/shop" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Shop
          </Link>
        </div>
        <div className="detail-grid" style={{ overflow: 'hidden' }}>
          <div className="detail-image-section">
            <div className="shop-detail-image-wrapper">
              <ImageWithFallback src={shopItem.image} alt={shopItem.title} className="shop-detail-image" />
            </div>
          </div>
          <div className="detail-info-section">
            <div className="detail-category">{shopItem.category}</div>
            <h1 className="detail-title">{shopItem.title}</h1>
            <p className="detail-price">{symbol}{value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            <p className="detail-description">{shopItem.description}</p>
            <div className="detail-actions">
              <button className="btn" onClick={() => addToCart(shopItem, 'shop')}>Add to Cart</button>
              <Link to="/shop" className="btn btn-secondary">Back to Shop</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
