import { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { FeaturedPaintings } from '../components/FeaturedPaintings';
import { NewsSection } from '../components/NewsSection';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { getExhibitions, getNews } from '../../api/client';
import { News, Exhibition } from '../../types';

export function Home() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exhibitionsData, newsData] = await Promise.all([
          getExhibitions(),
          getNews(),
        ]);
        setExhibitions(exhibitionsData);
        setNews(newsData);
      } catch (error) {
        console.error('Error loading home data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      <Hero exhibitions={exhibitions} />
      <FeaturedPaintings />
      <NewsSection news={news} />
      <About />
      <Contact />
    </div>
  );
}
