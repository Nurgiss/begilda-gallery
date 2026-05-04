import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { PaintingCard } from '../components/PaintingCard';
import { getPaintings } from '../../api/client';
import { useAppContext } from '../context/AppContext';
import { Painting } from '../../types';

export function Catalog() {
  const { currency, convertPrice } = useAppContext();
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaintings = async () => {
      try {
        const data = await getPaintings();
        // Filter out hidden paintings and exhibition-only paintings
        const visiblePaintings = data.filter(p => !p.hidden && !p.exhibitionOnly);
        setPaintings(visiblePaintings);
      } catch (error) {
        console.error('Error loading paintings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPaintings();
  }, []);

  const filteredPaintings = paintings;

  return (
    <div className="paintings-section">
      <Helmet>
        <title>Artworks — Begilda Gallery</title>
        <meta name="description" content="Browse original paintings and artworks at Begilda Gallery. Buy original art by Kazakh and international contemporary artists." />
        <meta property="og:title" content="Artworks — Begilda Gallery" />
        <meta property="og:description" content="Browse original paintings and artworks at Begilda Gallery." />
        <meta property="og:url" content="https://begildagallery.com/catalog" />
        <link rel="canonical" href="https://begildagallery.com/catalog" />
      </Helmet>
      <div className="container-wide">
        <h1 className="page-title-white">Artworks</h1>

        <div className="paintings-grid">
            {filteredPaintings.length > 0 ? (
              filteredPaintings.map((painting) => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
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
      </div>
    </div>
  );
}
