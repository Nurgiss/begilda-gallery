export interface Exhibition {
  id: string | number;
  title: string;
  artist: string;
  location: string;
  dates: string;
  description: string;
  image: string;
  imageUrl?: string;
  status: 'current' | 'upcoming' | 'past';
  paintingIds?: string[];
}
