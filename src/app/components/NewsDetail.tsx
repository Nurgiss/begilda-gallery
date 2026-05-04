import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { News } from '../../types';

interface NewsDetailProps {
  news: News | undefined;
}

export function NewsDetail({ news }: NewsDetailProps) {
  if (!news) {
    return (
      <div className="detail-page">
        <div className="container">
          <h1>News not found</h1>
          <Link to="/news" className="btn">Back to News</Link>
        </div>
      </div>
    );
  }

  const contentParagraphs = (news.content || '')
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="news-detail-page">
      <section className="news-detail-section">
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <Link
              to="/news"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'translateY(1px)' }}>
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to News
            </Link>
          </div>
          <div className="news-detail-header">
            <span className="news-category-large">{news.category}</span>
            <h1 className="news-detail-title">{news.title}</h1>
            <span className="news-date-large">{news.date}</span>
            {news.instagramUrl && (
              <a
                href={news.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="news-instagram-link"
              >
                Open on Instagram
              </a>
            )}
          </div>
          <div className="news-detail-image-wrapper">
            <ImageWithFallback src={news.image} alt={news.title} className="news-detail-image" />
          </div>
          <div className="news-detail-content">
            <p className="news-detail-excerpt">{news.excerpt}</p>
            <div className="news-detail-text">
              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{news.excerpt}</p>
              )}
            </div>

            {news.instagramUrl && (
              <div className="news-instagram-cta">
                <a
                  href={news.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-instagram-post"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
                  </svg>
                  <span>Open Instagram Post</span>
                </a>
              </div>
            )}
          </div>
          <div className="news-detail-footer">
            <Link to="/news" className="btn btn-secondary">All News</Link>
            <Link to="/" className="btn">Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
