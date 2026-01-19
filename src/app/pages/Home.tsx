import { Hero } from '../components/Hero';
import { FeaturedPaintings } from '../components/FeaturedPaintings';
import { NewsSection } from '../components/NewsSection';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { News, Exhibition, Currency } from '../../types';

interface HomeProps {
  onNavigate: (page: string, id?: string | number) => void;
  news: News[];
  exhibitions: Exhibition[];
  currency: Currency;
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