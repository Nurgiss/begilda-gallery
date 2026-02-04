import { ImageWithFallback } from './figma/ImageWithFallback';
import { News } from '../../types';

interface NewsListProps {
  news: News[];
}

export function NewsList({ news }: NewsListProps) {
  return (
    <div className="news-list-page">
      <section className="news-list-section">
        <div className="container-wide">
          <h1 className="page-title-white">News</h1>
          <p className="subtitle">Stay updated with the latest exhibitions, events and announcements</p>
          <div className="news-list-grid">
            {news.map((item) => (
              <a key={item.id} className="home-news-card" href={item.instagramUrl || 'https://instagram.com'} target="_blank" rel="noopener noreferrer">
                <div className="home-news-image-wrapper">
                  <ImageWithFallback src={item.image} alt={item.title} className="home-news-image" />
                </div>
                <div className="home-news-content">
                  <div className="home-news-meta">
                    <span className="home-news-category">{item.category}</span>
                    <span className="home-news-date">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="home-news-title">{item.title}</h3>
                  <p className="home-news-excerpt">{item.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
