import { Hero } from '../components/Hero';
import { FeaturedPaintings } from '../components/FeaturedPaintings';
import { NewsSection } from '../components/NewsSection';
import { About } from '../components/About';
import { Contact } from '../components/Contact';

interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  location: string;
  dates: string;
  description: string;
  image: string;
  status: 'current' | 'upcoming' | 'past';
}

interface HomeProps {
  onNavigate: (page: string, id?: number) => void;
  news: News[];
  exhibitions: Exhibition[];
  currency: 'USD'|'EUR'|'KZT';
  convertPrice?: (priceUSD: number) => number;
}

export function Home({ onNavigate, news, exhibitions, currency, convertPrice }: HomeProps) {
  return (
    <div>
      <Hero onNavigate={onNavigate} exhibitions={exhibitions} />
      <FeaturedPaintings 
        onPaintingClick={(id) => onNavigate('detail', id)} 
        onViewAll={() => onNavigate('catalog')} 
        currency={currency}
        convertPrice={convertPrice}
      />
      <NewsSection news={news} onNavigate={onNavigate} />
      <About />
      <Contact onNavigate={onNavigate} />
    </div>
  );
}