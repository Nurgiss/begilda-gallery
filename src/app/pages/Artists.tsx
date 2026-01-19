import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { getArtists, getPaintings } from '../../api/client';

interface Artist {
  id: string | number;
  name: string;
  bio: string;
  image: string;
  nationality: string;
  born: string;
  specialty: string;
}

interface Exhibition {
  id: string | number;
  title: string;
  artist: string;
  location: string;
  dates: string;
  description: string;
  image: string;
  status: 'current' | 'upcoming' | 'past';
}

interface Artwork {
  id: number;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  price: number;
  exhibitionId: number;
  artist?: string;
}

interface ArtistsProps {
  exhibitions: Exhibition[];
  selectedArtistId?: string | number;
  onNavigate: (page: string, id?: string | number, type?: 'painting' | 'shop') => void;
  addToCart?: (item: any, type: 'painting') => void;
}

export function Artists({ exhibitions, selectedArtistId, onNavigate, addToCart }: ArtistsProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [artistsData, paintingsData] = await Promise.all([
          getArtists(),
          getPaintings()
        ]);
        setArtists(artistsData);
        setArtworks(paintingsData);
      } catch (error) {
        console.error('Failed to load artists data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (selectedArtistId) {
    const artist = artists.find(a => a.id === selectedArtistId);
    const artistArtworks = artworks.filter(artwork => {
      // Используем поле artist из painting
      return artwork.artist === artist?.name;
    });

    if (!artist) {
      return (
        <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
          <p>Artist not found</p>
          <button className="btn" onClick={() => onNavigate('artists')} style={{ marginTop: 'var(--spacing-md)' }}>
            Back to Artists
          </button>
        </div>
      );
    }

    return (
      <div className="artist-detail-page">
        {/* Back Button */}
        <div className="container-wide" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => onNavigate('artists')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'translateY(1px)' }}>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Назад к артистам
          </button>
        </div>

        {/* All Works Grid */}
        <section className="artist-works-section">
          <div className="container-wide">
            <h2 className="section-title">All Works</h2>
            <div className="artist-works-grid">
              {artistArtworks.map((artwork) => (
                <div 
                  key={artwork.id} 
                  className="artist-work-item"
                  onClick={() => onNavigate('detail', artwork.id)}
                >
                  <ImageWithFallback 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="artist-work-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Artist Bio */}
        <section className="artist-bio-section">
          <div className="container">
            <div className="artist-bio-content">
              <div className="artist-bio-image">
                <ImageWithFallback 
                  src={artist.image} 
                  alt={artist.name}
                  className="artist-bio-photo"
                />
              </div>
              <div className="artist-bio-text">
                <h2 className="artist-bio-name">{artist.name}</h2>
                <p className="artist-bio-meta">{artist.nationality}, b. {artist.born}</p>
                <p className="artist-bio-specialty">{artist.specialty}</p>
                <p className="artist-bio-description">{artist.bio}</p>
                <button 
                  className="btn artist-contact-btn"
                  onClick={() => onNavigate('contact')}
                >
                  Contact Artist
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default view - artists list
  return (
    <div className="artists-page-white">
      <section className="artists-section-white">
        <div className="container-wide">
          <h1 className="page-title-white">Artists</h1>
          
          <div className="artists-grid-white">
            {artists.map((artist) => (
              <div 
                key={artist.id} 
                className="artist-card-white"
                onClick={() => onNavigate('artist-detail', artist.id)}
              >
                <div className="artist-info-white">
                  <h2 className="artist-name-white">{artist.name}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}