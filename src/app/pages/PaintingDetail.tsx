import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPaintings } from '../../api/client';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';
import { Painting } from '../../types';

export function PaintingDetail() {
  const { id } = useParams<{ id: string }>();
  const { currency, convertPrice, addToCart } = useAppContext();
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPainting = async () => {
      try {
        const paintings = await getPaintings();
        const found = paintings.find((p: Painting) => String(p.id) === id);
        setPainting(found || null);
      } catch (error) {
        console.error('Error loading painting:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPainting();
  }, [id]);

  if (loading) {
    return (
      <div className="container-wide" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!painting) {
    return (
      <div className="container-wide" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
        <p>Painting not found</p>
        <Link to="/catalog" className="btn" style={{ marginTop: 'var(--spacing-md)' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  let imageUrl = painting.image;
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    imageUrl = `http://localhost:3001${imageUrl}`;
  }

  const baseUSD = painting.priceUSD ?? painting.price ?? 0;
  const hasPrice = (painting.priceUSD ?? painting.price) != null;
  const displayPrice = convertPrice(baseUSD);
  const symbol = currency === 'EUR' ? '€' : currency === 'KZT' ? '₸' : '$';

  const handleAddToCart = () => {
    addToCart(painting, 'painting');
  };

  return (
    <div className="detail-page">
      <div className="container-wide">
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/catalog"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'translateY(1px)' }}>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Catalog
          </Link>
        </div>

        <div className="detail-grid" style={{ overflow: 'hidden' }}>
          <div>
            <div className="detail-main-image-wrapper">
              <ImageWithFallback src={imageUrl} alt={painting.title} className="detail-main-image" />
            </div>
          </div>

          <div className="detail-content">
            <h1 className="detail-title">{painting.title}</h1>
            {painting.artist && (
              <p style={{ fontSize: '1.15rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
                Artist: {painting.artist}
              </p>
            )}
            <p className="detail-price">
              {hasPrice ? (
                <>
                  {symbol}
                  {displayPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </>
              ) : (
                'Price on request'
              )}
            </p>

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Size</span>
                <span className="meta-value">{painting.dimensions || 'N/A'}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Material</span>
                <span className="meta-value">{painting.medium || 'N/A'}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">
                  {painting.category === 'abstract' && 'Abstract'}
                  {painting.category === 'landscape' && 'Landscape'}
                  {painting.category === 'portrait' && 'Portrait'}
                  {painting.category === 'modern' && 'Modern'}
                  {!painting.category && 'N/A'}
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className={`painting-status ${painting.availability ? 'status-available' : 'status-sold'}`}>
                  {painting.availability ? 'Available' : 'Sold'}
                </span>
              </div>
            </div>

            <p className="detail-description">{painting.description}</p>

            <div className="detail-actions">
              {painting.availability ? (
                <>
                  <button className="btn" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <Link to="/catalog" className="btn btn-secondary">
                    Back to Catalog
                  </Link>
                </>
              ) : (
                <>
                  <button className="btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    Sold
                  </button>
                  <Link to="/catalog" className="btn btn-secondary">
                    Back to Catalog
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
