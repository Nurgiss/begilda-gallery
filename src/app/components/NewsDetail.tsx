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

interface NewsDetailProps {
  news: News | undefined;
  onNavigate: (page: string) => void;
}

export function NewsDetail({ news, onNavigate }: NewsDetailProps) {
  if (!news) {
    return (
      <div className="detail-page">
        <div className="container">
          <h1>Новость не найдена</h1>
          <button className="btn" onClick={() => onNavigate('news')}>
            Вернуться к новостям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <section className="news-detail-section">
        <div className="container">
          <button 
            className="back-link" 
            onClick={() => onNavigate('news')}
          >
            ← Вернуться к новостям
          </button>

          <div className="news-detail-header">
            <span className="news-category-large">{news.category}</span>
            <h1 className="news-detail-title">{news.title}</h1>
            <span className="news-date-large">{news.date}</span>
          </div>

          <div className="news-detail-image-wrapper">
            <ImageWithFallback 
              src={news.image} 
              alt={news.title} 
              className="news-detail-image"
            />
          </div>

          <div className="news-detail-content">
            <p className="news-detail-excerpt">{news.excerpt}</p>
            <div className="news-detail-text">
              {news.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="news-detail-footer">
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigate('news')}
            >
              Все новости
            </button>
            <button 
              className="btn"
              onClick={() => onNavigate('home')}
            >
              На главную
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
