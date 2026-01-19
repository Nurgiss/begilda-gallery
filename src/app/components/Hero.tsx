interface Exhibition {
  id: string | number;
  title: string;
  location: string;
  dates: string;
  description: string;
  image: string;
  status: 'current' | 'upcoming' | 'past';
}

interface HeroProps {
  onNavigate: (page: string, id?: string | number) => void;
  exhibitions?: Exhibition[];
}

export function Hero({ onNavigate, exhibitions }: HeroProps) {
  const featuredExhibition = exhibitions?.find(e => e.status === 'current') || exhibitions?.[0];

  const bgStyle = featuredExhibition
    ? { backgroundImage: `url(${featuredExhibition.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: '#f5f5f5' };

  return (
    <section className="hero" style={{ ...bgStyle, minHeight: '100vh', position: 'relative' }}>
      <div className="hero-overlay" />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {featuredExhibition ? (
          <>
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
              <button className="btn" onClick={() => onNavigate('exhibition-detail', featuredExhibition.id)}>
                View Exhibition
              </button>
      
            </div>
          </>
        ) : (
          <>
            <h1 className="hero-title">Welcome to the Artist Portfolio</h1>
            <p className="hero-subtitle">Discover art, news, and creativity</p>
          </>
        )}
      </div>
      <div className="hero-scroll">Scroll down</div>
    </section>
  );
}
