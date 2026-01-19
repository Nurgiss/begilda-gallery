import { Painting } from '../../data/paintings';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PaintingCardProps {
  painting: Painting;
  onClick: () => void;
  currency?: 'USD'|'EUR'|'KZT';
  convertPrice?: (price: number) => number;
}

export function PaintingCard({ painting, onClick, currency = 'USD', convertPrice }: PaintingCardProps) {
  // Для картин базовая цена хранится в USD (priceUSD),
  // а также могут быть сохранены рассчитанные price (KZT) и priceEUR.
  const baseUSD = typeof painting.priceUSD === 'number' ? painting.priceUSD : (typeof (painting as any).priceUSD === 'number' ? (painting as any).priceUSD : painting.price);
  const converted = convertPrice ? convertPrice(baseUSD) : baseUSD;
  const symbol = currency === 'EUR' ? '€' : currency === 'KZT' ? '₸' : '$';
  
  // Поддержка как старого формата (imageUrl, size), так и нового из API (image, dimensions)
  let imageUrl = painting.imageUrl || painting.image;
  // Если путь начинается с /uploads/, добавляем базовый URL API
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    imageUrl = `http://localhost:3001${imageUrl}`;
  }
  const size = painting.size || painting.dimensions;
  
  return (
    <div className="home-painting-card" onClick={onClick}>
      <div className="home-painting-image-wrapper">
        <ImageWithFallback 
          src={imageUrl} 
          alt={painting.title} 
          className="home-painting-image"
        />
      </div>
      
      <div className="home-painting-info">
        <h3 className="home-painting-title">{painting.title}</h3>
        {painting.artist && <p className="home-painting-artist" style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem', fontStyle: 'italic' }}>{painting.artist}</p>}
        <p className="home-painting-size">{size}</p>
        <p className="home-painting-price">{symbol}{converted.toLocaleString(undefined, {maximumFractionDigits:2})}</p>
      </div>
    </div>
  );
}