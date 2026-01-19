import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Exhibition } from '../../types';

interface ExhibitionsProps {
  exhibitions: Exhibition[];
  onNavigate: (page: string, id?: string | number) => void;
}

export function Exhibitions({ exhibitions, onNavigate }: ExhibitionsProps) {
  const currentExhibitions = exhibitions.filter(e => e.status === 'current');
  const upcomingExhibitions = exhibitions.filter(e => e.status === 'upcoming');
  const pastExhibitions = exhibitions.filter(e => e.status === 'past');

  return (
    <div className="exhibitions-page-white">
      {/* Current Exhibitions */}
      {currentExhibitions.length > 0 && (
        <section className="exhibitions-section-white">
          <div className="container-wide">
            <h1 className="page-title-white">Current Exhibitions</h1>
            
            <div className="exhibitions-grid-white">
              {currentExhibitions.map((exhibition) => (
                <div 
                  key={exhibition.id} 
                  className="exhibition-card-white"
                  onClick={() => onNavigate('exhibition-detail', exhibition.id)}
                >
                  <div className="exhibition-card-image-wrapper">
                    <ImageWithFallback 
                      src={exhibition.image} 
                      alt={exhibition.title}
                      className="exhibition-card-image"
                    />
                  </div>
                  <div className="exhibition-card-content">
                    <h3 className="exhibition-card-artist">{exhibition.artist}</h3>
                    <p className="exhibition-card-title">{exhibition.title}</p>
                    <p className="exhibition-card-dates">{exhibition.dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Exhibitions */}
      {upcomingExhibitions.length > 0 && (
        <section className="exhibitions-upcoming-section">
          <div className="container-wide">
            <h2 className="section-title-white">Upcoming</h2>
            
            <div className="exhibitions-grid-white">
              {upcomingExhibitions.map((exhibition) => (
                <div 
                  key={exhibition.id} 
                  className="exhibition-card-white"
                  onClick={() => onNavigate('exhibition-detail', exhibition.id)}
                >
                  <div className="exhibition-card-image-wrapper">
                    <ImageWithFallback 
                      src={exhibition.image} 
                      alt={exhibition.title}
                      className="exhibition-card-image"
                    />
                  </div>
                  <div className="exhibition-card-content">
                    <h3 className="exhibition-card-artist">{exhibition.artist}</h3>
                    <p className="exhibition-card-title">{exhibition.title}</p>
                    <p className="exhibition-card-dates">{exhibition.dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Exhibitions */}
      {pastExhibitions.length > 0 && (
        <section className="exhibitions-section-white" style={{ backgroundColor: '#fafafa' }}>
          <div className="container-wide">
            <h2 className="section-title-white">Past Exhibitions</h2>
            
            <div className="exhibitions-grid-white">
              {pastExhibitions.map((exhibition) => (
                <div 
                  key={exhibition.id} 
                  className="exhibition-card-white"
                  onClick={() => onNavigate('exhibition-detail', exhibition.id)}
                >
                  <div className="exhibition-card-image-wrapper">
                    <ImageWithFallback 
                      src={exhibition.image} 
                      alt={exhibition.title}
                      className="exhibition-card-image"
                    />
                  </div>
                  <div className="exhibition-card-content">
                    <h3 className="exhibition-card-artist">{exhibition.artist}</h3>
                    <p className="exhibition-card-title">{exhibition.title}</p>
                    <p className="exhibition-card-dates">{exhibition.dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}