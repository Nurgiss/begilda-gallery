import { useState, useEffect } from 'react';
import { categoryLabels } from '../../data/paintings';
import { PaintingCard } from '../components/PaintingCard';
import { getPaintings } from '../../api/client';
import { Currency } from '../../types';

interface CatalogProps {
  onPaintingClick: (id: string | number) => void;
  currency: Currency;
  convertPrice?: (priceUSD: number) => number;
}

export function Catalog({ onPaintingClick, currency, convertPrice }: CatalogProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [paintings, setPaintings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaintings();
  }, []);

  const loadPaintings = async () => {
    try {
      const data = await getPaintings();
      console.log('Loaded paintings from API:', data);
      setPaintings(data);
    } catch (error) {
      console.error('Error loading paintings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPaintings = activeFilter === 'all' 
    ? paintings.filter(p => !p.exhibitionOnly)
    : paintings.filter(p => p.category === activeFilter && !p.exhibitionOnly);
  
  return (
    <div className="paintings-section">
      <div className="container-wide">
        <h1 className="section-title">Catalog</h1>
        
        <div className="filter-section">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
              onClick={() => setActiveFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : (
          <div className="paintings-grid">
            {filteredPaintings.length > 0 ? (
              filteredPaintings.map((painting) => (
                <PaintingCard 
                  key={painting.id}
                  painting={painting}
                  onClick={() => onPaintingClick(painting.id)}
                  currency={currency}
                  convertPrice={convertPrice}
                />
              ))
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--color-secondary)' }}>
                No paintings found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}