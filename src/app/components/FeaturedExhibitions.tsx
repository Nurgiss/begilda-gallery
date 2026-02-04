import { Link } from 'react-router-dom';

export function FeaturedExhibitions() {
  return (
    <section className="home-exhibitions-section">
      <div className="container">
        <div className="section-title">
          <h2>Exhibitions</h2>
          <p className="subtitle">A selection of current and upcoming exhibitions.</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/exhibitions" className="btn-white-outline">View All Exhibitions</Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedExhibitions;
