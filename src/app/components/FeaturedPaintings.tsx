import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings } from '../../api/client';
import { PaintingCard } from './PaintingCard';
import { useAppContext } from '../context/AppContext';
import { Painting } from '../../types';

export function FeaturedPaintings() {
  const { currency, convertPrice } = useAppContext();
  const [paintings, setPaintings] = useState<Painting[]>([]);

  useEffect(() => {
    getPaintings()
      .then((data) => setPaintings(data))
      .catch(console.error);
  }, []);

  const featuredPaintings = paintings.filter((p) => p.featured && !p.exhibitionOnly);

  return (
    <section className="home-paintings-section">
      <div className="container-wide">
        <h2 className="home-section-title">Featured Works</h2>
        

        <div className="home-paintings-grid">
          {featuredPaintings.map((painting) => (
            <PaintingCard
              key={painting.id}
              painting={painting}
              currency={currency}
              convertPrice={convertPrice}
            />
          ))}
        </div>

        {featuredPaintings.length > 0 && (
          <div className="home-section-cta">
            <Link to="/catalog" className="btn-white-outline">
              View All
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
