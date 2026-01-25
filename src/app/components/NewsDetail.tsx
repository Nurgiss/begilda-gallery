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

  return (
    <div className="news-detail-page">
      <section className="news-detail-section">
        <div className="container">
          <Link to="/news" className="back-link">← Back to News</Link>
          <div className="news-detail-header">
            <span className="news-category-large">{news.category}</span>
            <h1 className="news-detail-title">{news.title}</h1>
            <span className="news-date-large">{news.date}</span>
          </div>
          <div className="news-detail-image-wrapper">
            <ImageWithFallback src={news.image} alt={news.title} className="news-detail-image" />
          </div>
          <div className="news-detail-content">
            <p className="news-detail-excerpt">{news.excerpt}</p>
            <div className="news-detail-text">
              {news.content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
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
