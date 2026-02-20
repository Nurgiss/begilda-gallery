import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNews } from '../../api/client';
import { News } from '../../types';
import { NewsDetail } from '../components/NewsDetail';
import { LoadingModal } from '../components/ui/LoadingModal';

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews()
      .then(allNews => setNews(allNews.find((n: News) => String(n.id) === id)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingModal />;

  return <NewsDetail news={news} />;
}
