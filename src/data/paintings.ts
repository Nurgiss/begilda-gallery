export interface Painting {
  id: number;
  title: string;
  artist?: string; // Артист (необязательное поле)
  price: number;
  size: string;
  category: 'abstract' | 'landscape' | 'portrait' | 'modern';
  description: string;
  imageUrl: string;
  status: 'available' | 'sold';
  featured: boolean;
}

export const paintings: Painting[] = [
  {
    id: 1,
    title: 'Abstract Harmony',
    price: 450,
    size: '31x39 in',
    category: 'abstract',
    description: 'A bright abstract composition painted with acrylics on canvas. The interplay of color and form creates a unique mood.',
    imageUrl: 'https://images.unsplash.com/photo-1653144898324-baeff343d2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2NzU5NjY0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'available',
    featured: true
  },
  {
    id: 2,
    title: 'Modern Perspective',
    price: 520,
    size: '27x35 in',
    category: 'modern',
    description: 'A contemporary interpretation of classical forms. The minimalist palette emphasizes the depth of the composition.',
    imageUrl: 'https://images.unsplash.com/photo-1703936205356-11814e31bfda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBwYWludGluZ3xlbnwxfHx8fDE3Njc1MDUzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'available',
    featured: true
  },
  {
    id: 3,
    title: 'Mountain Landscape',
    price: 380,
    size: '23x31 in',
    category: 'landscape',
    description: 'A serene mountain landscape in warm tones. Perfect for creating a cozy atmosphere in any interior.',
    imageUrl: 'https://images.unsplash.com/photo-1700404837925-ad013953a624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBwYWludGluZyUyMGFydHxlbnwxfHx8fDE3Njc1OTY5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'available',
    featured: true
  },
  {
    id: 4,
    title: 'Portrait in Blue Tones',
    price: 650,
    size: '19x27 in',
    category: 'portrait',
    description: 'An expressive portrait painted in oil. Deep work with color and chiaroscuro.',
    imageUrl: 'https://images.unsplash.com/photo-1701958213864-2307a737e853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2NzYwNDg3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'sold',
    featured: false
  },
  {
    id: 5,
    title: 'Color Explosion',
    price: 480,
    size: '35x47 in',
    category: 'abstract',
    description: 'A dynamic abstraction with bright color accents. Large format perfect for spacious rooms.',
    imageUrl: 'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFic3RyYWN0JTIwYXJ0fGVufDF8fHx8MTc2NzYxMjg3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'available',
    featured: false
  },
  {
    id: 6,
    title: 'Minimalism',
    price: 420,
    size: '23x23 in',
    category: 'modern',
    description: 'A laconic composition in the spirit of minimalism. The perfect solution for modern interiors.',
    imageUrl: 'https://images.unsplash.com/photo-1580136607993-fd598cf5c4f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNjc2NjIxMTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'available',
    featured: false
  }
];

export const categoryLabels: Record<string, string> = {
  all: 'Все работы',
  abstract: 'Абстракция',
  landscape: 'Пейзаж',
  portrait: 'Портрет',
  modern: 'Современное'
};