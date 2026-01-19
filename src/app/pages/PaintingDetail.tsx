import { useState, useEffect } from 'react';
import { getPaintings } from '../../api/client';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Currency } from '../../types';

interface PaintingDetailProps {
  paintingId: string | number;
  onNavigate: (page: string, id?: number, type?: 'painting' | 'shop') => void;
  addToCart: (item: any, type: 'painting') => void;
  currency: Currency;
  convertPrice?: (priceUSD: number) => number;
}

export function PaintingDetail({ paintingId, onNavigate, addToCart, currency, convertPrice }: PaintingDetailProps) {
  const [paintings, setPaintings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaintings()
      .then(data => setPaintings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const painting = paintings.find(p => p.id === paintingId);
  
  // Исправление пути к изображению
  let imageUrl = '';
  if (painting) {
    imageUrl = painting.imageUrl || painting.image;
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
      imageUrl = `http://localhost:3001${imageUrl}`;
    }
  }
  
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
        <button className="btn" onClick={() => onNavigate('catalog')} style={{ marginTop: 'var(--spacing-md)' }}>
          Back to Catalog
        </button>
      </div>
    );
  }
  
  return (
    <div className="detail-page">
      <div className="container-wide">
        <div style={{ marginBottom: '2rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => onNavigate('catalog')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'translateY(1px)' }}>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Catalog
          </button>
        </div>
        <div className="detail-grid" style={{ overflow: 'hidden' }}>
          <div>
            <div className="detail-main-image-wrapper">
              <ImageWithFallback 
                src={imageUrl} 
                alt={painting.title} 
                className="detail-main-image"
              />
            </div>
          </div>
          
          <div className="detail-content">
            <h1 className="detail-title">{painting.title}</h1>
            {painting.artist && <p style={{ fontSize: '1.15rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>Artist: {painting.artist}</p>}
            {(() => {
              const baseUSD = typeof painting.priceUSD === 'number' ? painting.priceUSD : (painting.price || 0);
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
                <span className={`painting-status ${painting.availability !== false ? 'status-available' : 'status-sold'}`}>
                  {painting.availability !== false ? 'Available' : 'Sold'}
                </span>
              </div>
            </div>
            
            <p className="detail-description">{painting.description}</p>
            
            <div className="detail-actions">
              {painting.availability !== false ? (
                <>
                  <button 
                    className="btn" 
                    onClick={() => addToCart(painting, 'painting')}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onNavigate('catalog')}
                  >
                    Back to Catalog
                  </button>
                </>
              ) : (
                <>
                  <button className="btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    Sold
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onNavigate('catalog')}
                  >
                    Back to Catalog
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}