import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: 'Begilda Gallery',
    url: 'https://begildagallery.com/',
    logo: 'https://begildagallery.com/assets/logo-CtgGDPxM.png',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Begilda Gallery',
    url: 'https://begildagallery.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://begildagallery.com/catalog',
      'query-input': 'required name=search_term_string',
    },
  };

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
      <Helmet>
        <title>Begilda Gallery — Contemporary Art Gallery in Almaty</title>
        <meta name="description" content="Begilda Gallery is a contemporary art gallery in Almaty showcasing paintings, sculptures and art objects by Kazakh and international artists. Explore current exhibitions and original artworks." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Begilda Gallery — Contemporary Art Gallery in Almaty" />
        <meta property="og:description" content="Contemporary art gallery in Almaty. Original paintings, sculptures, and art objects by Kazakh and international artists." />
        <meta property="og:url" content="https://begildagallery.com/" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://begildagallery.com/" />
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>
      <Hero exhibitions={exhibitions} />
      <FeaturedPaintings />
      <NewsSection news={news} />
      <About />
      <Contact />
    </div>
  );
}
