import { Link } from 'react-router-dom';
import { Painting } from '../../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PaintingCardProps {
  painting: Painting;
  currency?: 'USD' | 'EUR' | 'KZT';
  convertPrice?: (price: number) => number;
}

export function PaintingCard({ painting, currency = 'USD', convertPrice }: PaintingCardProps) {
  const baseUSD = painting.priceUSD ?? painting.price;
  const converted = convertPrice ? convertPrice(baseUSD) : baseUSD;
  const symbol = currency === 'EUR' ? '€' : currency === 'KZT' ? '₸' : '$';

  let imageUrl = painting.image;
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    imageUrl = `http://localhost:3001${imageUrl}`;
  }
  const size = painting.dimensions;

  return (
    <Link to={`/catalog/${painting.id}`} className="home-painting-card">
      <div className="home-painting-image-wrapper">
        <ImageWithFallback
          src={imageUrl}
          alt={painting.title}
          className="home-painting-image"
        />
      </div>

      <div className="home-painting-info">
        <h3 className="home-painting-title">{painting.title}</h3>
        {painting.artist && (
          <p
            className="home-painting-artist"
            style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem', fontStyle: 'italic' }}
          >
            {painting.artist}
          </p>
        )}
        <p className="home-painting-size">{size}</p>
        <p className="home-painting-price">
          {symbol}
          {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>
    </Link>
  );
}
