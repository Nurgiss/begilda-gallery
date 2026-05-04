import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getExhibitions } from '../../api/client';
import { Exhibition } from '../../types';

function ExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Link to={`/exhibitions/${exhibition.id}`} className="exhibition-card-white">
      <div className="exhibition-card-image-wrapper">
        <ImageWithFallback src={exhibition.image} alt={exhibition.title} className="exhibition-card-image" />
      </div>
      <div className="exhibition-card-content">
        <h3 className="exhibition-card-artist">{exhibition.artist}</h3>
        <p className="exhibition-card-title">{exhibition.title}</p>
        <p className="exhibition-card-dates">{exhibition.dates}</p>
      </div>
    </Link>
  );
}

export function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        const data = await getExhibitions();
        setExhibitions(data);
      } catch (error) {
        console.error('Error loading exhibitions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadExhibitions();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
        <p>Loading exhibitions...</p>
      </div>
    );
  }

  const currentExhibitions = exhibitions.filter((e) => e.status === 'current');
  const upcomingExhibitions = exhibitions.filter((e) => e.status === 'upcoming');
  const pastExhibitions = exhibitions.filter((e) => e.status === 'past');

  return (
    <div className="exhibitions-page-white">
      <Helmet>
        <title>Exhibitions — Begilda Gallery</title>
        <meta name="description" content="Current, upcoming and past art exhibitions at Begilda Gallery in Almaty. Discover contemporary art shows and events." />
        <meta property="og:title" content="Exhibitions — Begilda Gallery" />
        <meta property="og:description" content="Current, upcoming and past art exhibitions at Begilda Gallery in Almaty." />
        <meta property="og:url" content="https://begildagallery.com/exhibitions" />
        <link rel="canonical" href="https://begildagallery.com/exhibitions" />
      </Helmet>
      {currentExhibitions.length > 0 && (
        <section className="exhibitions-section-white">
          <div className="container-wide">
            <h1 className="page-title-white">Current Exhibitions</h1>
            <div className="exhibitions-grid-white">
              {currentExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          </div>
        </section>
      )}

      {upcomingExhibitions.length > 0 && (
        <section className="exhibitions-upcoming-section">
          <div className="container-wide">
            <h2 className="section-title-white">Upcoming Exhibitions </h2>
            <div className="exhibitions-grid-white">
              {upcomingExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          </div>
        </section>
      )}

      {pastExhibitions.length > 0 && (
        <section className="exhibitions-section-white" style={{ backgroundColor: '#fafafa' }}>
          <div className="container-wide">
            <h2 className="section-title-white">Past Exhibitions</h2>
            <div className="exhibitions-grid-white">
              {pastExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
