import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNews, getNewsArticle } from '../../api/client';
import { News } from '../../types';
import { NewsDetail } from '../components/NewsDetail';
import { LoadingModal } from '../components/ui/LoadingModal';

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setNews(undefined);
      setLoading(false);
      return;
    }

    getNewsArticle(id)
      .then((item) => setNews(item))
      .catch(async (error) => {
        console.error(error);
        try {
          const allNews = await getNews();
          setNews(allNews.find((n: News) => String(n.id) === id));
        } catch (fallbackError) {
          console.error(fallbackError);
          setNews(undefined);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingModal />;

  return <NewsDetail news={news} />;
}
