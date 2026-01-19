import { ImageWithFallback } from './figma/ImageWithFallback';

interface News {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

interface NewsSectionProps {
  news: News[];
  onNavigate: (page: string, newsId?: string | number) => void;
}

export function NewsSection({ news, onNavigate }: NewsSectionProps) {
  const latestNews = news.slice(0, 3);

  return (
    <section className="home-news-section">
      <div className="container-wide">
        <h2 className="home-section-title">Latest News</h2>
        <p className="home-section-subtitle">
          Stay updated with the latest exhibitions, events and new works
        </p>

        <div className="home-news-grid">
          {latestNews.map((item) => (
            <a
              key={item.id}
              className="home-news-card"
              href={item.instagramUrl || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="home-news-image-wrapper">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="home-news-image"
                />
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

        {news.length > 3 && (
          <div className="home-section-cta">
            <button 
              className="btn-white-outline"
              onClick={() => onNavigate('news')}
            >
              View All News
            </button>
          </div>
        )}
      </div>
    </section>
  );
}