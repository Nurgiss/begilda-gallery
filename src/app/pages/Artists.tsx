import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getArtists, getPaintings } from '../../api/client';
import { Artist, Artwork } from '../../types';

export function Artists() {
  const { id } = useParams<{ id: string }>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getArtists(), getPaintings()])
      .then(([a, p]) => { setArtists(a); setArtworks(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}><p>Loading...</p></div>;

  if (id) {
    const artist = artists.find(a => String(a.id) === id);
    const artistArtworks = artworks.filter(artwork => artwork.artist === artist?.name);

    if (!artist) {
      return (
        <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
          <p>Artist not found</p>
          <Link to="/artists" className="btn" style={{ marginTop: 'var(--spacing-md)' }}>Back to Artists</Link>
        </div>
      );
    }

    return (
      <div className="artist-detail-page">
        <div className="container-wide" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
          <Link to="/artists" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Artists
          </Link>
        </div>
        <section className="artist-works-section">
          <div className="container-wide">
            <h2 className="section-title">All Works</h2>
            <div className="artist-works-grid">
              {artistArtworks.map((artwork) => (
                <Link key={artwork.id} to={`/catalog/${artwork.id}`} className="artist-work-item">
                  <ImageWithFallback src={artwork.image} alt={artwork.title} className="artist-work-image" />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="artist-bio-section">
          <div className="container">
            <div className="artist-bio-content">
              <div className="artist-bio-image"><ImageWithFallback src={artist.image} alt={artist.name} className="artist-bio-photo" /></div>
              <div className="artist-bio-text">
                <h2 className="artist-bio-name">{artist.name}</h2>
                <p className="artist-bio-meta">{artist.nationality}, b. {artist.born}</p>
                <p className="artist-bio-specialty">{artist.specialty}</p>
                <p className="artist-bio-description">{artist.bio}</p>
                <Link to="/" className="btn artist-contact-btn">Contact Artist</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="artists-page-white">
      <section className="artists-section-white">
        <div className="container-wide">
          <h1 className="page-title-white">Artists</h1>
          <div className="artists-grid-white">
            {artists.map((artist) => (
              <Link key={artist.id} to={`/artists/${artist.id}`} className="artist-card-white">
                <div className="artist-info-white"><h2 className="artist-name-white">{artist.name}</h2></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
