import { useState, useEffect } from 'react';
import { getNews } from '../../api/client';
import { News } from '../../types';
import { NewsList } from '../components/NewsList';

export function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews().then(setNews).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}><p>Loading news...</p></div>;

  return <NewsList news={news} />;
}
