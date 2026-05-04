import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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

  return (
    <>
      <Helmet>
        <title>News — Begilda Gallery</title>
        <meta name="description" content="Latest news, events and announcements from Begilda Gallery in Almaty." />
        <meta property="og:title" content="News — Begilda Gallery" />
        <meta property="og:url" content="https://begildagallery.com/news" />
        <link rel="canonical" href="https://begildagallery.com/news" />
      </Helmet>
      <NewsList news={news} />
    </>
  );
}
