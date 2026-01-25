import { Link } from 'react-router-dom';
import { Exhibition } from '../../types';

interface HeroProps {
  exhibitions?: Exhibition[];
}

export function Hero({ exhibitions }: HeroProps) {
  const featuredExhibition = exhibitions?.find(e => e.status === 'current') || exhibitions?.[0];

  if (!featuredExhibition) {
    return null;
  }

  const bgStyle = {
    backgroundImage: `url(${featuredExhibition.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section className="hero" style={{ ...bgStyle, minHeight: '100vh', position: 'relative' }}>
      <div className="hero-overlay" />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center' }}>
          <span className="hero-exhibition-badge">Current Exhibition</span>
        </div>
        <h1 className="hero-title">{featuredExhibition.title}</h1>
        <p className="hero-subtitle">{featuredExhibition.description}</p>

        <div className="hero-exhibition-info">
          <div className="hero-info-item">
            <span className="hero-info-label">Location</span>
            <span className="hero-info-value">{featuredExhibition.location}</span>
          </div>
          <div className="hero-info-item">
            <span className="hero-info-label">Dates</span>
            <span className="hero-info-value">{featuredExhibition.dates}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={`/exhibitions/${featuredExhibition.id}`} className="btn">
            View Exhibition
          </Link>
        </div>
      </div>
      <div className="hero-scroll">Scroll down</div>
    </section>
  );
}
