import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getPaintings, getExhibition } from '../../api/client';
import { Exhibition } from '../../types';

interface ExhibitionDetailProps {
  exhibition: Exhibition | undefined;
  onNavigate: (page: string, id?: string | number) => void;
}

export function ExhibitionDetail({ exhibition, onNavigate }: ExhibitionDetailProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exhibitionPaintings, setExhibitionPaintings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем актуальную версию выставки и связанные с ней картины
  useEffect(() => {
    const loadExhibitionPaintings = async () => {
      try {
        if (!exhibition) {
          setExhibitionPaintings([]);
          setLoading(false);
          return;
        }

        // Берём свежую версию выставки из backend (там точно есть paintingIds)
        const fullExhibition: any = await getExhibition(String(exhibition.id));

        if (fullExhibition?.paintingIds && fullExhibition.paintingIds.length > 0) {
          const allPaintings = await getPaintings();
          const filtered = allPaintings.filter((p: any) =>
            fullExhibition.paintingIds.includes(p.id)
          );
          setExhibitionPaintings(filtered);
        } else {
          setExhibitionPaintings([]);
        }
      } catch (err) {
        console.error('Error loading exhibition paintings:', err);
        setExhibitionPaintings([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadExhibitionPaintings();
  }, [exhibition]);

  if (!exhibition) {
    return (
      <div className="exhibition-detail-page">
        <div className="container">
          <h1>Exhibition not found</h1>
          <button className="btn" onClick={() => onNavigate('exhibitions')}>
            Back to Exhibitions
          </button>
        </div>
      </div>
    );
  }

  const displayArtworks = exhibitionPaintings;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayArtworks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayArtworks.length) % displayArtworks.length);
  };

  return (
    <div className="exhibition-detail-page">
      {/* Hero Section */}
      <section className="exhibition-hero">
        <div className="exhibition-hero-image-wrapper">
          <ImageWithFallback 
            src={exhibition.image} 
            alt={exhibition.title}
            className="exhibition-hero-image"
          />
          <div className="exhibition-hero-overlay">
            <div className="container-wide">
              <h1 className="exhibition-hero-title">{exhibition.title}</h1>
              <p className="exhibition-hero-subtitle">{exhibition.location}</p>
              <p className="exhibition-hero-dates">{exhibition.dates}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibition Details */}
      <section className="exhibition-details">
        <div className="container-wide">
          <div className="exhibition-details-grid">
            <div className="exhibition-details-left">
              <div className="detail-item">
                <h3 className="detail-label">Dates</h3>
                <p className="detail-value">{exhibition.dates}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Location</h3>
                <p className="detail-value">{exhibition.location}</p>
              </div>
              <button className="share-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 10.5c-.7 0-1.3.3-1.8.7l-4.7-2.7c.1-.2.1-.3.1-.5s0-.3-.1-.5l4.7-2.7c.5.5 1.1.7 1.8.7 1.4 0 2.5-1.1 2.5-2.5S14.4.5 13 .5s-2.5 1.1-2.5 2.5c0 .2 0 .3.1.5L6 6.2c-.5-.5-1.1-.7-1.8-.7C2.8 5.5 1.7 6.6 1.7 8s1.1 2.5 2.5 2.5c.7 0 1.3-.3 1.8-.7l4.7 2.7c-.1.2-.1.3-.1.5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5-1.1-2.5-2.6-2.5z" fill="currentColor"/>
                </svg>
                Share
              </button>
            </div>
            <div className="exhibition-details-right">
              <p className="exhibition-description">{exhibition.description}</p>
              {displayArtworks.length > 0 && (
                <p className="exhibition-description">
                  This exhibition features {displayArtworks.length} carefully selected pieces that demonstrate 
                  {loading ? ' the artistic vision and continued exploration of form, color, and concept.' : 
                   ' the artistic vision and continued exploration of form, color, and concept.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Slider */}
      {displayArtworks.length > 0 && (
        <section className="exhibition-slider-section">
          <div className="container-wide">
            <h2 className="section-title-white">Featured Works</h2>
            
            <div className="exhibition-slider">
              <div className="slider-main">
                <button className="slider-btn slider-btn-prev" onClick={prevSlide}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <div className="slider-image-wrapper">
                  <ImageWithFallback 
                    src={displayArtworks[currentSlide]?.image || displayArtworks[currentSlide]?.imageUrl} 
                    alt={displayArtworks[currentSlide]?.title}
                    className="slider-image"
                  />
                </div>

                <button className="slider-btn slider-btn-next" onClick={nextSlide}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="slider-info">
                <h3 className="slider-artwork-title">{displayArtworks[currentSlide]?.title}</h3>
                <p className="slider-artwork-meta">
                  {displayArtworks[currentSlide]?.year} · {displayArtworks[currentSlide]?.medium || 'Mixed Media'}
                </p>
                <p className="slider-artwork-dimensions">{displayArtworks[currentSlide]?.dimensions}</p>
                {displayArtworks[currentSlide]?.price && (
                  <p className="slider-artwork-price">${displayArtworks[currentSlide]?.price.toLocaleString()}</p>
                )}
              </div>

              <div className="slider-dots">
                {displayArtworks.map((_, index) => (
                  <button
                    key={index}
                    className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Artworks Grid */}
      {displayArtworks.length > 0 && (
        <section className="exhibition-artworks-section">
          <div className="container-wide">
            <h2 className="section-title-white">All Works</h2>
            
            <div className="artworks-grid-white">
              {displayArtworks.map((artwork) => {
                const imageUrl = artwork.imageUrl || artwork.image;
                const displayImage = imageUrl?.startsWith('/uploads/') 
                  ? `http://localhost:3001${imageUrl}` 
                  : imageUrl;
                
                return (
                  <div key={artwork.id} className="artwork-card-white">
                    <div className="artwork-image-wrapper">
                      <ImageWithFallback 
                        src={displayImage} 
                        alt={artwork.title}
                        className="artwork-image"
                      />
                    </div>
                    <div className="artwork-info">
                      <h3 className="artwork-title">{artwork.title}</h3>
                      <p className="artwork-meta">{artwork.year} · {artwork.medium || 'Mixed Media'}</p>
                      <p className="artwork-dimensions">{artwork.dimensions || ''}</p>
                      {artwork.priceUSD && (
                        <p className="artwork-price">${artwork.priceUSD.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <section className="exhibition-back-section">
        <div className="container-wide">
          <button className="btn btn-secondary" onClick={() => onNavigate('exhibitions')}>
            ← Back to Exhibitions
          </button>
        </div>
      </section>
    </div>
  );
}
