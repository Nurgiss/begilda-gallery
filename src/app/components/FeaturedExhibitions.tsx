import { Link } from 'react-router-dom';

export function FeaturedExhibitions() {
  return (
    <section className="home-exhibitions-section">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <h2 className="home-section-title">Exhibitions</h2>
          <p className="home-section-subtitle">A selection of current and upcoming exhibitions.</p>
          <Link to="/exhibitions" className="btn-white-outline">View All Exhibitions</Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedExhibitions;
