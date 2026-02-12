import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getPaintings, getExhibition } from '../../api/client';
import { PaintingCard } from '../components/PaintingCard';
import { useAppContext } from '../context/AppContext';
import { Exhibition, Painting } from '../../types';

export function ExhibitionDetail() {
  const { id } = useParams<{ id: string }>();
  const { currency, convertPrice } = useAppContext();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exhibitionPaintings, setExhibitionPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExhibitionData = async () => {
      try {
        if (!id) {
          setLoading(false);
          return;
        }

        const fullExhibition = await getExhibition(id);
        setExhibition(fullExhibition);

        if (fullExhibition?.paintingIds && fullExhibition.paintingIds.length > 0) {
          const allPaintings = await getPaintings();
          const paintingIds = fullExhibition.paintingIds;
          const filtered = allPaintings.filter((p: Painting) =>
            paintingIds.includes(String(p.id))
          );
          setExhibitionPaintings(filtered);
        } else {
          setExhibitionPaintings([]);
        }
      } catch (err) {
        console.error('Error loading exhibition:', err);
        setExhibition(null);
        setExhibitionPaintings([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadExhibitionData();
  }, [id]);

  if (loading) {
    return (
      <div className="exhibition-detail-page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="exhibition-detail-page">
        <div className="container">
          <h1>Exhibition not found</h1>
          <Link to="/exhibitions" className="btn">
            Back to Exhibitions
          </Link>
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
                    src={displayArtworks[currentSlide]?.image}
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
            
            <div className="home-paintings-grid">
              {displayArtworks.map((painting) => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
                  currency={currency}
                  convertPrice={convertPrice}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <section className="exhibition-back-section">
        <div className="container-wide">
          <Link to="/exhibitions" className="btn btn-secondary">
            ← Back to Exhibitions
          </Link>
        </div>
      </section>
    </div>
  );
}
