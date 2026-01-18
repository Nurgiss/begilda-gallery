import { useState, useEffect } from 'react';
import { getPaintings } from '../../api/client';
import { PaintingCard } from './PaintingCard';

interface FeaturedPaintingsProps {
  onPaintingClick: (id: string | number) => void;
  currency?: 'USD'|'EUR'|'KZT';
  convertPrice?: (price: number) => number;
  onViewAll?: () => void;
}

export function FeaturedPaintings({ onPaintingClick, currency = 'USD', convertPrice, onViewAll }: FeaturedPaintingsProps) {
  const [paintings, setPaintings] = useState<any[]>([]);

  useEffect(() => {
    getPaintings().then(data => setPaintings(data)).catch(console.error);
  }, []);

  const featuredPaintings = paintings.filter(p => p.featured);
  
  return (
    <section className="home-paintings-section">
      <div className="container-wide">
        <h2 className="home-section-title">Featured Works</h2>
        <p className="home-section-subtitle">
          Specially selected works that best represent the artistic vision and style
        </p>
        
        <div className="home-paintings-grid">
          {featuredPaintings.map((painting) => (
            <PaintingCard 
              key={painting.id}
              painting={painting}
              onClick={() => onPaintingClick(painting.id)}
              currency={currency}
              convertPrice={convertPrice}
            />
          ))}
        </div>
        {featuredPaintings.length > 0 && (
          <div className="home-section-cta">
            <button 
              className="btn-white-outline"
              onClick={() => onViewAll ? onViewAll() : undefined}
            >
              View All
            </button>
          </div>
        )}
      </div>
    </section>
  );
}