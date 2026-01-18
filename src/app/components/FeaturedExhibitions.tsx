import React from 'react';

interface Props {
  onNavigate?: (page: string) => void;
}

export function FeaturedExhibitions({ onNavigate = () => {} }: Props) {
  return (
    <section className="home-exhibitions-section">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <h2 className="home-section-title">Exhibitions</h2>
          <p className="home-section-subtitle">A selection of current and upcoming exhibitions.</p>

          <button 
            className="btn-white-outline"
            onClick={() => onNavigate('exhibitions')}
          >
            View All Exhibitions
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedExhibitions;