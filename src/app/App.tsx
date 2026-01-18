import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeaderDark } from './components/HeaderDark';
import { AdminHeader } from './components/AdminHeader';
import AdminLogin from './pages/admin/AdminLogin';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Exhibitions } from './pages/Exhibitions';
import { ExhibitionDetail } from './pages/ExhibitionDetail';
import { Artists } from './pages/Artists';
import { Shop } from './pages/Shop';
import { ShopDetail } from './pages/ShopDetail';
import { Catalog } from './pages/Catalog';
import { PaintingDetail } from './pages/PaintingDetail';
import { Checkout } from './pages/Checkout';
import { NewsList } from './components/NewsList';
import { NewsDetail } from './components/NewsDetail';
import { PaintingsManager } from './pages/admin/PaintingsManager';
import { OrdersManager } from './pages/admin/OrdersManager';
import { NewsManager } from './pages/admin/NewsManager';
import { ExhibitionsManager } from './pages/admin/ExhibitionsManager';
import { ArtistsManager } from './pages/admin/ArtistsManager';
import { ShopManager } from './pages/admin/ShopManager';
import { CurrencySettings } from './pages/admin/CurrencySettings';
import { getPaintings, getExhibitions } from '../api/client';
import '../styles/index.css';

type Page = 'home' | 'exhibitions' | 'artists' | 'news' | 'catalog' | 'shop' | 'detail' | 'shop-detail' | 'exhibition-detail' | 'artist-detail' | 'checkout' | 'cart' | 'contact' | 'news-detail' | 'admin-paintings' | 'admin-orders' | 'admin-news' | 'admin-exhibitions' | 'admin-artists' | 'admin-shop';

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

interface Artist {
  id: number;
  name: string;
  bio: string;
  image: string;
  nationality: string;
  born: string;
  specialty: string;
}

interface ShopItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface Artwork {
  id: number;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  price?: number;
  exhibitionId: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try { return !!localStorage.getItem('adminToken'); } catch (e) { return false; }
  });
  const [currency, setCurrency] = useState<'USD'|'EUR'|'KZT'>('USD');
  const [rates, setRates] = useState<{EUR:number;KZT:number}>({ EUR: 0.92, KZT: 480 });
  const [selectedPaintingId, setSelectedPaintingId] = useState<string | number | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<number | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [selectedShopItemId, setSelectedShopItemId] = useState<number | null>(null);
  const [cart, setCart] = useState<Array<{item: any, type: 'painting' | 'shop', quantity: number}>>(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      // Фильтруем битые элементы, у которых нет item или id
      return parsed.filter((entry) => entry && entry.item && typeof entry.item.id !== 'undefined');
    } catch (e) {
      return [];
    }
  });
  
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  const [artists, setArtists] = useState<Artist[]>([
    {
      id: 1,
      name: 'Marina Volkov',
      bio: 'Marina Volkov is a celebrated contemporary artist known for her bold abstract compositions. Her work explores the intersection of color, emotion, and form, creating immersive visual experiences that challenge traditional boundaries.',
      image: 'https://images.unsplash.com/photo-1529943684416-9d29047b809e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3Njc2OTQ1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Russian',
      born: '1982',
      specialty: 'Abstract Painting'
    },
    {
      id: 2,
      name: 'Alexander Petrov',
      bio: 'Alexander Petrov works across multiple mediums to create thought-provoking installations. His practice examines contemporary culture, technology, and human connection in the digital age.',
      image: 'https://images.unsplash.com/photo-1611244420030-b22f359eee31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVyJTIwd29ya2luZyUyMGFydHxlbnwxfHx8fDE3Njc3MDE1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Russian',
      born: '1975',
      specialty: 'Mixed Media, Installation'
    },
    {
      id: 3,
      name: 'Elena Sokolova',
      bio: 'Elena Sokolova is a sculptor whose work seamlessly blends classical techniques with contemporary aesthetics. Her pieces explore themes of memory, identity, and transformation.',
      image: 'https://images.unsplash.com/photo-1761655072443-9dec151c3e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3VscHRvciUyMGFydGlzdCUyMGNyZWF0aXZlfGVufDF8fHx8MTc2NzcwMTUyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Russian',
      born: '1988',
      specialty: 'Sculpture'
    },
    {
      id: 4,
      name: 'Sophie Laurent',
      bio: 'Sophie Laurent is a French impressionist painter whose landscapes capture the fleeting beauty of light and atmosphere. Her work reflects a deep connection to nature and the passage of time.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGZyZW5jaHxlbnwxfHx8fDE3Njc3MDE1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'French',
      born: '1979',
      specialty: 'Impressionist Painting'
    },
    {
      id: 5,
      name: 'Carlos Mendoza',
      bio: 'Carlos Mendoza creates vibrant street art that addresses social issues and cultural identity. His murals bring color and meaning to urban spaces across Latin America.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMG1leGljYW58ZW58MXx8fHwxNzY3NzAxNTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Mexican',
      born: '1985',
      specialty: 'Street Art, Murals'
    },
    {
      id: 6,
      name: 'Yuki Tanaka',
      bio: 'Yuki Tanaka is a Japanese ceramicist whose minimalist designs reflect Zen philosophy. Her pottery combines traditional techniques with contemporary forms.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGphcGFuZXNlfGVufDF8fHx8MTc2NzcwMTUyMnww&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Japanese',
      born: '1972',
      specialty: 'Ceramics, Pottery'
    },
    {
      id: 7,
      name: 'Marcus Thompson',
      bio: 'Marcus Thompson is an American photographer whose documentary work captures the human experience in urban environments. His images tell stories of resilience and community.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGFtZXJpY2FufGVufDF8fHx8MTc2NzcwMTUyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'American',
      born: '1980',
      specialty: 'Documentary Photography'
    },
    {
      id: 8,
      name: 'Isabella Rossi',
      bio: 'Isabella Rossi is an Italian fashion designer whose couture collections blend traditional craftsmanship with innovative materials. Her work redefines luxury fashion.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGl0YWxpYW58ZW58MXx8fHwxNzY3NzAxNTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Italian',
      born: '1987',
      specialty: 'Fashion Design'
    },
    {
      id: 9,
      name: 'Ahmed Hassan',
      bio: 'Ahmed Hassan is an Egyptian calligrapher whose modern interpretations of Arabic script create stunning visual poetry. His work bridges ancient traditions with contemporary art.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGVneXB0aWFufGVufDF8fHx8MTc2NzcwMTUyNXww&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Egyptian',
      born: '1978',
      specialty: 'Arabic Calligraphy'
    },
    {
      id: 10,
      name: 'Anna Schmidt',
      bio: 'Anna Schmidt is a German glassblower whose intricate sculptures explore themes of fragility and transparency. Her work combines technical precision with artistic expression.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGdlcm1hbnxlbnwxfHx8fDE3Njc3MDE1MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'German',
      born: '1983',
      specialty: 'Glass Sculpture'
    },
    {
      id: 11,
      name: 'Liam O\'Connor',
      bio: 'Liam O\'Connor is an Irish illustrator whose whimsical drawings bring folklore and mythology to life. His work appears in children\'s books and animated films.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGlyaXNofGVufDF8fHx8MTc2NzcwMTUyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Irish',
      born: '1990',
      specialty: 'Illustration, Children\'s Books'
    },
    {
      id: 12,
      name: 'Priya Sharma',
      bio: 'Priya Sharma is an Indian textile artist whose intricate weaves combine traditional techniques with contemporary designs. Her work celebrates cultural heritage and innovation.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGluZGlhbnxlbnwxfHx8fDE3Njc3MDE1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Indian',
      born: '1981',
      specialty: 'Textile Art, Weaving'
    },
    {
      id: 13,
      name: 'Diego Silva',
      bio: 'Diego Silva is a Brazilian digital artist whose interactive installations explore the relationship between humans and technology. His work questions our digital future.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGJyYXppbGlhbnxlbnwxfHx8fDE3Njc3MDE1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Brazilian',
      born: '1986',
      specialty: 'Digital Art, Interactive Installations'
    },
    {
      id: 14,
      name: 'Nina Kowalski',
      bio: 'Nina Kowalski is a Polish performance artist whose provocative work challenges societal norms and explores themes of identity and belonging.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMHBvbGlzaHxlbnwxfHx8fDE3Njc3MDE1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Polish',
      born: '1977',
      specialty: 'Performance Art'
    },
    {
      id: 15,
      name: 'James Chen',
      bio: 'James Chen is a Canadian architect-turned-sculptor whose large-scale installations transform public spaces. His work explores the intersection of form and function.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGNhbmFkaWFufGVufDF8fHx8MTc2NzcwMTUzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Canadian',
      born: '1974',
      specialty: 'Large-Scale Sculpture'
    },
    {
      id: 16,
      name: 'Amara Okafor',
      bio: 'Amara Okafor is a Nigerian jeweler whose contemporary designs incorporate traditional African motifs. Her work celebrates cultural heritage while pushing artistic boundaries.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMG5pZ2VyaWFufGVufDF8fHx8MTc2NzcwMTUzMXww&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Nigerian',
      born: '1989',
      specialty: 'Contemporary Jewelry'
    },
    {
      id: 17,
      name: 'Santiago Morales',
      bio: 'Santiago Morales is a Colombian filmmaker and video artist whose documentaries explore social justice issues. His work combines storytelling with visual poetry.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGNvbG9tYmlhbnxlbnwxfHx8fDE3Njc3MDE1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Colombian',
      born: '1984',
      specialty: 'Video Art, Documentary'
    },
    {
      id: 18,
      name: 'Freya Nielsen',
      bio: 'Freya Nielsen is a Danish sound artist whose immersive audio installations explore the relationship between sound, space, and human perception.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGRhbmlzaHxlbnwxfHx8fDE3Njc3MDE1MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Danish',
      born: '1976',
      specialty: 'Sound Art, Audio Installations'
    },
    {
      id: 19,
      name: 'Raj Patel',
      bio: 'Raj Patel is a British-Indian conceptual artist whose work examines cultural hybridity and diaspora experiences. His installations challenge viewers to reconsider identity.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMGJyaXRpc2glMjBpbmRpYW58ZW58MXx8fHwxNzY3NzAxNTM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'British-Indian',
      born: '1982',
      specialty: 'Conceptual Art'
    },
    {
      id: 20,
      name: 'Luna García',
      bio: 'Luna García is a Spanish muralist whose vibrant public art brings communities together. Her work addresses environmental issues and social justice through bold imagery.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMHNwYW5pc2h8ZW58MXx8fHwxNzY3NzAxNTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      nationality: 'Spanish',
      born: '1991',
      specialty: 'Public Art, Murals'
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const exhibitionsData = await getExhibitions();
        setExhibitions(exhibitionsData);
      } catch (error) {
        console.error('Error loading exhibitions:', error);
      }
    };
    loadData();
  }, []);

  const [shopItems, setShopItems] = useState<ShopItem[]>([
    {
      id: 1,
      title: 'Limited Edition Print - "Horizon"',
      artist: 'Marina Volkov',
      price: 450,
      image: 'https://images.unsplash.com/photo-1705071243469-5031dc36c12c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwcmludCUyMHBvc3RlcnxlbnwxfHx8fDE3Njc3MDE1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Prints',
      description: 'Archival pigment print on museum-quality paper. Edition of 50, signed and numbered by the artist.'
    },
    {
      id: 2,
      title: 'Exhibition Catalogue - Contemporary Visions',
      artist: 'Various Artists',
      price: 65,
      image: 'https://images.unsplash.com/photo-1588609460031-22705bc49db0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2NzcwMTUyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Books',
      description: 'Comprehensive catalogue featuring essays, artist interviews, and full-color reproductions.'
    },
    {
      id: 3,
      title: 'Small Sculpture - "Fragment"',
      artist: 'Elena Sokolova',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1617596223856-a17ba0eac50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc2N1bHB0dXJlfGVufDF8fHx8MTc2NzY5MjY1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Sculpture',
      description: 'Bronze sculpture with patina finish. Unique piece from the artist\'s studio collection.'
    }
  ]);
  
  const [news, setNews] = useState<News[]>([
    {
      id: 1,
      title: 'New Exhibition "Colors of Nature" Opens to Critical Acclaim',
      excerpt: 'Marina Volkov\'s solo exhibition explores the intricate relationship between Russian landscapes and human emotion.',
      content: `**MOSCOW, January 15, 2025** - The Modern Art Gallery today opened its doors to Marina Volkov's highly anticipated solo exhibition "Colors of Nature," marking what critics are calling a "watershed moment in contemporary Russian landscape painting."

The exhibition, which spans three spacious galleries on the museum's second floor, features thirty-two meticulously crafted works completed over the past twenty-four months. Each piece represents a different season and emotional state, from the stark minimalism of winter's "Silent Forests" series to the vibrant explosions of color in "Summer Meadows Awakening."

**A Return to Roots**

"This exhibition represents my deepest connection to the Russian soul," Volkov told reporters during yesterday's preview. "Nature isn't just a backdrop for our lives—it's the very fabric of our cultural identity. Through these paintings, I'm attempting to capture not just visual beauty, but the spiritual essence of our landscapes."

The collection includes several large-scale canvases measuring up to 2.5 meters wide, created using Volkov's signature technique of layering translucent glazes that create depth and luminosity. Art historians have noted influences ranging from 19th-century Russian Romantic painters like Ivan Shishkin to contemporary abstractionists like Gerhard Richter.

**Critical Reception**

Early reviews have been overwhelmingly positive. Writing in today's Art Review, critic Elena Petrova called the exhibition "a masterful synthesis of tradition and innovation that reminds us why landscape painting remains relevant in our digital age."

The exhibition runs through February 28, with free admission daily from 10:00 AM to 8:00 PM. Special guided tours are available every Saturday at 2:00 PM, and the gallery's café will feature seasonal Russian-inspired cuisine throughout the run.

**About the Artist**

Marina Volkov, born in St. Petersburg in 1982, has exhibited internationally and is represented in major collections including the State Tretyakov Gallery and the Museum of Modern Art in New York. This is her third solo exhibition at the Modern Art Gallery.`,
      image: 'https://images.unsplash.com/photo-1743119668395-62c8089a1eb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzY3NjkwNjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-05',
      category: 'Exhibition'
    },
    {
      id: 2,
      title: 'Master Oil Painting Workshop: From Beginner to Pro in One Weekend',
      excerpt: 'Professional artist Alexander Petrov shares his techniques for creating stunning landscapes in this intensive hands-on workshop.',
      content: `**HANDS-ON ART EDUCATION** - In an era of digital art and instant gratification, there's something profoundly satisfying about the slow, deliberate process of oil painting. This weekend, the Modern Art Gallery offers art enthusiasts an opportunity to dive deep into this timeless medium under the expert guidance of renowned artist Alexander Petrov.

**Workshop Overview**

The three-hour intensive session, scheduled for Saturday, January 20th at 2:00 PM, will guide participants through the complete process of creating a landscape painting from concept to completion. "We'll start with composition and value studies," Petrov explains, "then move through color mixing, brush techniques, and finally the layering process that gives oil paintings their characteristic depth and luminosity."

**What You'll Learn**

- **Composition Fundamentals**: Understanding the rule of thirds, focal points, and visual hierarchy
- **Color Theory**: Mixing realistic flesh tones, creating natural shadows, and achieving color harmony
- **Brush Techniques**: Loading brushes properly, creating texture, and blending seamlessly
- **Oil Painting Basics**: Working with mediums, solvents, and understanding drying times

**Materials Provided**

All participants receive a comprehensive kit including:
- Professional-grade oil paints (titanium white, cadmium yellow, ultramarine blue, alizarin crimson, and burnt sienna)
- Assorted brushes (flats, rounds, and filberts in various sizes)
- Pre-stretched canvas (16x20 inches)
- Odorless mineral spirits and painting medium
- Palette knives and other essential tools

**About the Instructor**

Alexander Petrov brings over 15 years of professional painting experience to this workshop. His work has been featured in galleries across Europe and Asia, and he currently serves as a visiting professor at the Moscow Academy of Arts. "Teaching is my passion," he says. "There's nothing more rewarding than seeing someone discover their artistic voice."

**Limited Spots Available**

Due to the hands-on nature of the workshop, space is limited to 12 participants. Early registration is strongly recommended. Cost: 150 USD per person (includes all materials and light refreshments).

**Who Should Attend**

This workshop is perfect for:
- Complete beginners interested in trying oil painting
- Experienced artists looking to refine their techniques
- Art students seeking professional instruction
- Anyone interested in a creative weekend activity

**Registration Details**

To reserve your spot, contact the gallery education department at education@modernartgallery.com or call (495) 123-4567. Payment can be made online or at the gallery reception.

Don't miss this opportunity to create something beautiful while learning from one of Russia's most respected contemporary artists!`,
      image: 'https://images.unsplash.com/photo-1688216130114-4b5245d70fcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBzdHVkaW8lMjBwYWludGluZ3xlbnwxfHx8fDE3Njc2OTA2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-03',
      category: 'Workshop'
    },
    {
      id: 3,
      title: 'Artwork of the Month: "Sunset over the Sea" - A Journey Through Light and Memory',
      excerpt: 'Elena Sokolova\'s latest masterpiece captures the ephemeral beauty of the Black Sea coastline, blending classical technique with contemporary emotion.',
      content: `**ARTWORK SPOTLIGHT** - In the hushed galleries of the Modern Art Gallery, amidst the clamor of contemporary installations and digital projections, hangs a painting that speaks to the timeless power of traditional oil painting. "Sunset over the Sea" by sculptor-turned-painter Elena Sokolova is our Artwork of the Month for January, and it's a masterpiece that demands contemplation.

**The Inspiration**

Created during Sokolova's month-long residency on the Crimean peninsula last summer, the painting captures a specific moment: the instant when the sun dips below the horizon, bathing the Black Sea in molten gold. "I wanted to capture not just the visual spectacle, but the emotional weight of that moment," Sokolova explains. "That feeling of time standing still, when the world holds its breath between day and night."

**Technical Mastery**

Measuring 80 by 100 centimeters, the work is executed in Sokolova's signature impasto technique, where thick layers of oil paint are applied with palette knives to create texture and depth. The canvas becomes almost sculptural, with waves that seem to rise from the surface and clouds that appear to float in three-dimensional space.

**Color and Light**

The painting's color palette is deceptively simple yet achingly beautiful: deep ultramarines and ceruleans for the sea, warm cadmiums and ochres for the sky, and subtle earth tones for the distant cliffs. But it's the light—the way it filters through the atmosphere, creating that magical golden hour glow—that elevates this work from mere representation to something transcendent.

**Critical Context**

Sokolova, who trained as a sculptor at the prestigious Moscow Art Institute, brings a three-dimensional sensibility to her paintings. "Sculpture taught me to think about form, volume, and space," she says. "When I paint, I'm essentially sculpting with light and color."

This approach is evident in "Sunset over the Sea," where the composition creates a sense of depth that draws the viewer into the scene. The foreground rocks, rendered with thick, tactile strokes, contrast beautifully with the smooth, ethereal quality of the distant horizon.

**Market Value and Availability**

Currently priced at $2,500, the painting represents excellent value for collectors interested in contemporary representational art. Sokolova's work has been steadily appreciating, with pieces from her early career now commanding five-figure sums at auction.

**Viewing and Acquisition**

"Sunset over the Sea" is currently on display in the gallery's main exhibition space and will remain available for viewing through the end of January. Interested collectors are encouraged to contact our acquisitions department to arrange a private viewing or discuss financing options.

**About Elena Sokolova**

Born in Moscow in 1988, Elena Sokolova initially gained recognition for her bronze sculptures before transitioning to painting in 2018. Her work has been exhibited in galleries across Russia and Europe, and she was recently named one of Art Review's "30 Under 30" emerging artists to watch.

In a world increasingly dominated by digital art and conceptual installations, Sokolova's commitment to traditional techniques and representational subject matter feels both nostalgic and revolutionary. "Art should move people," she says. "It should make them feel something deep and true. That's why I paint what I see, what I feel, what I remember."

"Sunset over the Sea" accomplishes exactly that—transporting viewers to a place of quiet contemplation, where the beauty of the natural world reminds us of our own capacity for wonder.`,
      image: 'https://images.unsplash.com/photo-1757085242669-076c35ff9397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB3b3Jrc2hvcCUyMGNyZWF0aXZlfGVufDF8fHx8MTc2NzU5OTEzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-01',
      category: 'Announcement'
    },
    {
      id: 4,
      title: 'Contemporary Art Symposium: Digital Realities and the Future of Creative Expression',
      excerpt: 'Leading artists, curators, and technologists gather to explore the intersection of art and technology in this groundbreaking symposium.',
      content: `**BREAKING NEWS: ART MEETS TECHNOLOGY**

**Moscow, January 10, 2025** - The Modern Art Gallery will host what promises to be one of the most significant art events of 2025: the Contemporary Art Symposium "Digital Realities," bringing together over 200 artists, curators, technologists, and industry leaders for a day-long exploration of how technology is reshaping creative expression.

**Revolutionary Lineup**

The symposium features an unprecedented lineup of international speakers including:

- **Marina Volkov** (Russia) - "AI as Creative Collaborator: When Machines Become Muses"
- **Dr. Alexander Petrov** (Russia) - "Virtual Reality: Beyond the Screen and Into the Soul"
- **Dr. Sarah Chen** (Singapore) - "NFTs and the Democratization of Art Ownership"
- **Prof. Hiroshi Tanaka** (Japan) - "Bio-Art: When Living Matter Becomes Medium"
- **Marcus Johnson** (USA) - "Digital Preservation: Saving Our Cultural Heritage in the Cloud"

**Morning Session: The Digital Canvas**

Opening at 9:00 AM with a keynote by Marina Volkov, the morning session will explore how artificial intelligence is transforming the creative process. "AI isn't replacing artists," Volkov argues. "It's amplifying our creativity, allowing us to explore possibilities we never could have imagined alone."

This will be followed by a panel discussion on virtual and augmented reality in art spaces, featuring curators from the Guggenheim, Tate Modern, and Centre Pompidou.

**Afternoon Deep Dive**

The afternoon program delves into practical applications and future possibilities:

- **Blockchain and Art**: How NFTs are creating new economic models for artists
- **Bio-Art Workshop**: Hands-on demonstration of living art installations
- **Digital Conservation**: Using AI to preserve and restore cultural artifacts
- **Interactive Installations**: Creating immersive experiences that respond to viewers

**Special Features**

- **Live Demonstrations**: Watch artists create digital works in real-time
- **Networking Lounge**: Connect with speakers and fellow attendees
- **Exhibition Preview**: Exclusive access to upcoming digital art installations
- **Startup Showcase**: Meet innovative companies shaping the future of art tech

**Venue and Logistics**

The symposium will be held in the gallery's state-of-the-art auditorium, equipped with the latest presentation technology and simultaneous translation in Russian, English, and Mandarin.

**Ticket Information**

- Early Bird (until January 31): 150 USD
- Regular Admission: 200 USD
- Student/Senior: 100 USD
- VIP Package (includes lunch with speakers): 350 USD

All tickets include access to all sessions, digital materials, and refreshments throughout the day.

**Why This Matters**

In an age where technology touches every aspect of our lives, the art world cannot remain untouched. "We're at a tipping point," says symposium organizer Dr. Elena Sokolova. "Artists who embrace technology will lead the cultural conversation of the 21st century. Those who don't risk becoming irrelevant."

**Registration and Information**

Secure your spot at this groundbreaking event by visiting modernartgallery.com/symposium or calling our events line at (495) 123-4567. Space is limited, so early registration is recommended.

**About the Modern Art Gallery**

Founded in 1995, the Modern Art Gallery has been at the forefront of contemporary art in Russia, championing both traditional and experimental approaches to creative expression. This symposium represents our continued commitment to fostering dialogue between art, technology, and society.`,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBzeW1wb3NpdW0lMjBldmVudHxlbnwxfHx8fDE3Njc3MDI0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-10',
      category: 'Event'
    },
    {
      id: 5,
      title: 'Historic Acquisition: Shishkin Masterpiece Joins Permanent Collection',
      excerpt: 'The gallery acquires a rare 19th-century landscape by Ivan Shishkin, strengthening its Russian art holdings.',
      content: `**MAJOR ACQUISITION ANNOUNCEMENT**

**Moscow, January 8, 2025** - In a move that will send ripples through the international art world, the Modern Art Gallery today announced the acquisition of Ivan Shishkin's "Winter Morning in the Forest" (1889), a masterpiece of Russian landscape painting that has been privately held for over 50 years.

**A Rare Opportunity**

The painting, which measures 120 x 180 centimeters and is executed in Shishkin's signature detailed style, depicts a serene winter landscape in the forests near St. Petersburg. "This acquisition represents the culmination of years of careful planning and negotiation," said gallery director Dr. Vladimir Kuznetsov. "Works of this caliber rarely come to market, and we were fortunate to have the support of our trustees and major donors to make this possible."

**Artistic Significance**

Ivan Ivanovich Shishkin (1832-1898) is widely regarded as Russia's greatest landscape painter, often called the "Tsar of the Forest" for his unparalleled ability to capture the majesty and mystery of Russian woodlands. "Winter Morning in the Forest" exemplifies Shishkin's mature style, combining meticulous attention to detail with a profound understanding of light, atmosphere, and natural form.

The work features Shishkin's characteristic technique of building up layers of paint to create texture and depth, particularly evident in the intricate rendering of snow-covered branches and the subtle play of light filtering through the forest canopy.

**Provenance and History**

The painting's provenance is impeccable, having been commissioned directly from the artist by industrialist Sergei Morozov in 1889. It remained in the Morozov family collection until 1945, when it was acquired by a private collector during the post-war art market. This is the first time the work has been publicly exhibited since the 1930s.

**Conservation and Display**

Before going on public display, the painting will undergo a comprehensive conservation treatment in the gallery's new state-of-the-art laboratory. "Shishkin's works require specialized care due to his use of complex glazing techniques and natural pigments," explained chief conservator Dr. Anna Petrova. "We're employing the latest scientific methods to ensure this masterpiece remains vibrant for future generations."

**Public Access**

"Winter Morning in the Forest" will be unveiled to the public on February 1st as part of the gallery's permanent collection galleries. It will be displayed alongside other Russian masterpieces, providing visitors with a comprehensive view of the nation's artistic heritage.

**Financial Details**

While the gallery has not disclosed the acquisition price, industry sources estimate the painting's value at between 15-20 million USD. The purchase was made possible through a combination of gallery funds, private donations, and a special loan from the Russian Ministry of Culture.

**Broader Impact**

This acquisition significantly strengthens the gallery's holdings of 19th-century Russian art, which already include important works by Repin, Serov, and Levitan. "Our collection now tells a more complete story of Russian art," said curator Maria Ivanova. "From the academic traditions of the 19th century to the experimental works of contemporary artists, we can show the full arc of Russian creative expression."

**Educational Programs**

The acquisition will inspire a series of educational programs, including:
- Family workshops on landscape painting techniques
- Scholarly lectures on Shishkin's techniques and influences
- Special exhibitions exploring Russian landscape painting traditions

**International Recognition**

The acquisition has already garnered international attention, with congratulations coming from institutions including the Hermitage Museum, the State Tretyakov Gallery, and the Metropolitan Museum of Art. "This is a major addition to the world's understanding of Russian art," said Dr. James Smith of the Metropolitan Museum. "The Modern Art Gallery is to be commended for their vision and commitment to Russian cultural heritage."

**Looking Forward**

As the gallery prepares for the public unveiling, director Kuznetsov reflected on the broader significance: "Art institutions have a responsibility to preserve and present the cultural achievements of their nations. With this acquisition, we're not just adding a beautiful painting to our collection—we're safeguarding a piece of Russia's artistic soul for future generations to discover and cherish."`,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3Njc3MDI0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-08',
      category: 'Collection'
    },
    {
      id: 6,
      title: 'Artist Residency Program: Call for Applications - Transform Your Practice',
      excerpt: 'The Modern Art Gallery launches its most comprehensive artist residency program yet, offering unparalleled resources and mentorship.',
      content: `**OPPORTUNITY ALERT: ARTIST RESIDENCY PROGRAM NOW OPEN**

**Moscow, January 12, 2025** - The Modern Art Gallery is pleased to announce that applications are now open for its flagship Artist Residency Program, offering emerging and established artists an unprecedented opportunity to develop their practice in one of Russia's most dynamic creative environments.

**Program Overview**

The 2025 residency program offers three-month immersive experiences for up to six artists, providing:

- **Dedicated Studio Space**: Private 40-square-meter studios equipped with natural light, ventilation, and basic art supplies
- **Professional Mentorship**: One-on-one sessions with established artists and curators
- **Technical Resources**: Access to the gallery's workshop facilities, including printmaking, digital fabrication, and traditional painting studios
- **Exhibition Opportunity**: Guaranteed solo exhibition at the end of the residency period
- **Living Stipend**: Monthly stipend of 50,000 RUB to cover living expenses
- **Networking**: Introduction to Moscow's vibrant art community and international connections

**Eligibility and Selection**

The program is open to artists working in all mediums and at all career stages. Previous residents have included painters, sculptors, digital artists, and interdisciplinary practitioners. There are no age restrictions, though applicants should demonstrate a commitment to their artistic development.

**Selection Process**

Applications will be reviewed by a jury including:
- Gallery Director Dr. Vladimir Kuznetsov
- Curator Maria Ivanova
- Artist Marina Volkov
- International curator Dr. Sarah Chen (Singapore)

**Application Requirements**

- **Portfolio**: 10-15 images of recent work (PDF format, max 10MB)
- **Artist Statement**: 500-word statement describing your practice and residency goals
- **CV/Resume**: Professional background and exhibition history
- **Project Proposal**: 1000-word description of what you plan to accomplish during the residency
- **References**: Contact information for two professional references

**Important Dates**

- Application Deadline: February 28, 2025
- Notification of Selection: March 15, 2025
- Residency Period: April 1 - June 30, 2025
- Opening Exhibition: June 20, 2025

**Past Success Stories**

The residency program has launched numerous successful careers. Previous resident Anna Petrova went on to win the prestigious Kandinsky Prize, while digital artist Marcus Chen's residency work was acquired by the Victoria & Albert Museum.

**Program Philosophy**

"We believe that artists thrive in community," says program director Elena Sokolova. "Our residency isn't just about providing space—it's about creating an ecosystem where creativity can flourish through dialogue, collaboration, and mutual inspiration."

**Diversity and Inclusion**

The gallery is committed to diversity and actively encourages applications from underrepresented groups, including artists from regions outside major urban centers, LGBTQ+ artists, and practitioners from diverse cultural backgrounds.

**Accommodation and Support**

Residents receive furnished apartments within walking distance of the gallery, along with comprehensive support including visa assistance for international artists, language translation services, and cultural orientation programs.

**How to Apply**

Applications must be submitted through the gallery's online portal at modernartgallery.com/residency. The application fee is 50 USD (waived for applicants from developing countries or those experiencing financial hardship).

**Contact Information**

For questions about the program or application process, contact the residency coordinator at residency@modernartgallery.com or call (495) 123-4567.

**Don't Miss This Opportunity**

In an increasingly competitive art world, a residency at the Modern Art Gallery can be a career-defining experience. Whether you're looking to refine your technique, explore new directions, or build your professional network, this program offers the resources and environment to help you achieve your artistic goals.

The deadline is fast approaching—submit your application today and take the next step in your artistic journey!`,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjByZXNpZGVuY3klMjBwcm9ncmFtfGVufDF8fHx8MTc2NzcwMjQwMnww&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-12',
      category: 'Opportunity'
    },
    {
      id: 7,
      title: 'Holiday Hours Extended: Gallery Opens Doors Wider for Festive Season',
      excerpt: 'Extended hours and special programming ensure art lovers can enjoy the holidays at the gallery.',
      content: `**HOLIDAY ANNOUNCEMENT**

**Moscow, January 15, 2025** - As the holiday season reaches its peak, the Modern Art Gallery is extending its hours and rolling out special programming to ensure that art lovers can celebrate the season surrounded by beauty and inspiration.

**Extended Hours Schedule**

Starting December 20th and continuing through January 5th, the gallery will operate on the following extended schedule:

- **Monday - Saturday**: 10:00 AM - 8:00 PM (regular closing time is 6:00 PM)
- **Sunday**: 12:00 PM - 6:00 PM (unchanged)
- **New Year's Eve (December 31)**: Open until 4:00 PM
- **New Year's Day (January 1)**: Closed
- **Christmas Day (January 7)**: Closed

**Special Holiday Programming**

The extended hours aren't just about more time—they're about creating memorable holiday experiences:

**Holiday Art Workshops**
- Family-friendly ornament painting sessions every weekend
- Adult workshops focusing on winter landscape techniques
- Children's art classes with seasonal themes

**Festive Exhibitions**
- Special installation of holiday-themed contemporary art
- Historical display of Russian Christmas traditions in art
- Interactive light installations in the sculpture garden

**Culinary Experiences**
- Partnership with local cafés for holiday-themed refreshments
- Gallery café featuring seasonal Russian specialties
- Wine and art pairings on Friday and Saturday evenings

**Community Events**
- Free holiday concerts in the main atrium
- Story time sessions for children with art-themed tales
- Volunteer opportunities for local charity organizations

**Why Extended Hours Matter**

"During the holidays, people are looking for meaningful experiences that bring families together," said gallery director Dr. Vladimir Kuznetsov. "Art has the power to create those moments of connection and wonder. By staying open later, we're ensuring that more people can discover the joy of art during this special time."

**Visitor Statistics and Impact**

Last year's extended holiday hours saw a 40% increase in weekend attendance, with families and young adults comprising the largest growth segments. "We're not just a gallery during the holidays," said visitor services manager Olga Petrova. "We're a community gathering place where art becomes part of the celebration."

**Safety and Accessibility**

The gallery has implemented enhanced safety measures for the holiday season:
- Increased security presence
- Improved crowd management protocols
- Enhanced accessibility services for visitors with disabilities
- Free coat check and stroller parking

**Transportation and Parking**

With extended hours coinciding with holiday shopping, the gallery offers:
- Complimentary valet parking after 5:00 PM
- Shuttle service from nearby metro stations
- Bike racks for eco-conscious visitors
- Designated loading zones for ride-share services

**Special Holiday Membership Offer**

New members who join during the holiday period receive:
- 20% discount on membership fees
- Priority access to special events
- Complimentary guest passes for family members
- Exclusive holiday merchandise discounts

**Looking Ahead**

As the holiday season winds down, the gallery will transition into its regular programming with exciting exhibitions and events planned for the new year. "The holidays are a time of renewal," said Dr. Kuznetsov. "We're excited to start 2025 with the same energy and commitment to bringing art to our community."

**Contact Information**

For more information about holiday hours, events, or accessibility services, visit modernartgallery.com/holidays or call our visitor services line at (495) 123-4567.

The Modern Art Gallery wishes you a joyful holiday season filled with art, inspiration, and meaningful connections!`,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBob2xpZGF5JTIwc2Vhc29ufGVufDF8fHx8MTc2NzcwMjQwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-15',
      category: 'Announcement'
    },
    {
      id: 8,
      title: 'Art Basel Miami Beach 2025: Gallery Makes Strong Showing at Premier International Fair',
      excerpt: 'The Modern Art Gallery presents works by Marina Volkov, Alexander Petrov, and emerging artists at one of the world\'s most prestigious art fairs.',
      content: `**INTERNATIONAL ART WORLD NEWS**

**Miami Beach, December 4-8, 2025** - The Modern Art Gallery made a significant impact at Art Basel Miami Beach 2025, one of the world's most prestigious international art fairs, presenting a curated selection of contemporary Russian art that drew widespread critical and commercial attention.

**Booth Overview**

Located in the coveted Collins Park section of the fair, the gallery's 200-square-meter booth featured:

- **Marina Volkov**: Three large-scale abstract paintings from her "Digital Horizons" series
- **Alexander Petrov**: Interactive digital installation "Memory Fragments"
- **Elena Sokolova**: Bronze sculpture "Eternal Movement" and related studies
- **Emerging Artists**: Works by three artists from the gallery's residency program

**Market Performance**

The fair proved highly successful commercially, with several works finding new homes:
- Volkov's "Crimson Algorithm" sold for $85,000 to a private collector from Singapore
- Petrov's installation secured a long-term loan to the Pérez Art Museum Miami
- Two emerging artists' works were acquired by American institutions

**Critical Reception**

Reviewers praised the gallery's curatorial vision. Writing in Artforum, critic Jessica Goldstein called the presentation "a sophisticated introduction to contemporary Russian art that transcends stereotypes and showcases the diversity and innovation of Moscow's creative scene."

**Networking and Partnerships**

The fair provided valuable opportunities for international collaboration:
- Discussions with curators from MoMA and the Guggenheim about potential exhibitions
- Meetings with collectors interested in Russian contemporary art
- Partnerships with international galleries for artist exchanges

**VIP Preview and Events**

The gallery hosted several successful events during the fair:
- Private dinner for major collectors featuring Russian cuisine
- Artist talks and studio visits for VIP guests
- Special preview of upcoming Moscow exhibitions

**Broader Context**

Art Basel Miami Beach, now in its 23rd year, attracts over 80,000 visitors and features 300+ galleries from 40 countries. The fair's focus on contemporary art makes it an ideal platform for emerging artists and international exposure.

**Future Plans**

The success at Miami Beach opens doors for future international participation:
- Confirmed presence at Frieze London 2026
- Potential solo exhibitions in New York and Los Angeles
- Expanded artist exchange programs with American institutions

**Artist Testimonials**

Marina Volkov reflected on the experience: "Showing in Miami was transformative. The international audience brought fresh perspectives to my work and opened up new dialogues about abstraction and technology."

Alexander Petrov added: "The fair's energy is electric. Being able to present interactive work to such a diverse audience was incredibly rewarding."

**Gallery Leadership Perspective**

Director Dr. Vladimir Kuznetsov emphasized the importance of international exposure: "Art Basel Miami Beach represents the pinnacle of the global art market. Our strong showing demonstrates that Russian contemporary art has arrived on the world stage and has much to contribute to the international conversation."

**Economic Impact**

The fair generated significant economic benefits:
- Direct sales exceeding $200,000
- Long-term loans and exhibition commitments worth over $500,000
- Increased visibility leading to inquiries from international collectors

**Looking Forward**

As the art world becomes increasingly global, fairs like Art Basel Miami Beach play a crucial role in connecting artists with international audiences. The Modern Art Gallery's success signals a new chapter in Russian art's global presence, promising more international collaborations and exhibitions in the coming years.

**About Art Basel**

Founded in 1970 in Basel, Switzerland, Art Basel has expanded to include fairs in Miami Beach, Hong Kong, and Paris, representing the world's leading galleries and the most significant developments in contemporary art.`,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBmYWlyJTIwZXZlbnR8ZW58MXx8fHwxNzY3NzAyNDA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-18',
      category: 'Event'
    },
    {
      id: 9,
      title: 'Virtual Gallery Tour: Explore Our Collections from Anywhere in the World',
      excerpt: 'New immersive online experience brings museum-quality art to your screen with cutting-edge technology.',
      content: `**DIGITAL INNOVATION IN ART ACCESS**

**Moscow, January 20, 2025** - The Modern Art Gallery today launched its most ambitious digital initiative yet: a comprehensive virtual tour that brings the museum experience to art lovers worldwide, regardless of their physical location.

**Revolutionary Technology**

The virtual tour utilizes state-of-the-art 360° photography and interactive elements to create an immersive experience that rivals visiting the gallery in person. Key features include:

- **High-Resolution Imaging**: Every artwork photographed at 100+ megapixels
- **360° Navigation**: Walk through galleries as if you were there
- **Zoom Functionality**: Examine brushstrokes and details up close
- **Audio Commentary**: Curator-led tours and artist interviews
- **Interactive Hotspots**: Click on artworks for detailed information

**Technical Specifications**

- **Photography**: Captured with Phase One IQ4 digital backs
- **Stitching**: Automated using Autodesk Reality Capture software
- **Platform**: Custom-built using WebGL and Three.js frameworks
- **Compatibility**: Works on desktop, tablet, and mobile devices
- **Loading**: Optimized for fast streaming worldwide

**Content Highlights**

The virtual tour includes:

**Permanent Collection Galleries**
- Russian avant-garde masterpieces
- Contemporary installations
- Sculpture garden walkthrough
- Special exhibitions archive

**Current Exhibitions**
- "Colors of Nature" by Marina Volkov
- "Digital Realities" interactive installations
- Historical collections with detailed provenance

**Educational Resources**
- Artist biographies and interviews
- Conservation technique demonstrations
- Art historical context and analysis
- Behind-the-scenes studio visits

**Accessibility Features**

The virtual tour is designed with accessibility in mind:
- Screen reader compatibility
- Keyboard navigation
- Adjustable text sizes and contrast
- Multi-language support (Russian, English, Spanish, Mandarin)
- Closed captioning for all audio content

**Educational Partnerships**

The gallery has partnered with educational institutions worldwide:
- Virtual field trips for schools and universities
- Distance learning modules for art history courses
- Professional development for art educators
- Accessibility programs for underserved communities

**Community Impact**

Since launch, the virtual tour has already reached over 50,000 users from 120 countries. "This isn't just about accessibility," says digital director Alexei Petrov. "It's about democratizing art education and making our collection available to anyone with an internet connection."

**Success Metrics**

Early analytics show impressive engagement:
- Average session duration: 45 minutes
- Most viewed artworks: Marina Volkov's abstract series
- Peak usage times: Evenings and weekends
- Return visitor rate: 35%

**Future Developments**

The virtual tour is just the beginning of the gallery's digital expansion:
- **VR Headset Support**: Coming Q2 2025
- **Live Virtual Events**: Artist talks and gallery tours
- **Interactive Learning Modules**: Hands-on art activities
- **Virtual Collection**: Digital art acquisitions

**Technical Challenges Overcome**

Creating the virtual tour required overcoming significant technical hurdles:
- Lighting consistency across 360° captures
- Minimizing stitching artifacts in complex spaces
- Optimizing file sizes for global streaming
- Ensuring accurate color representation

**Artist Perspectives**

Artists featured in the virtual tour have embraced the technology. Marina Volkov commented: "The virtual tour allows people to experience my work in ways I never imagined. Someone in Tokyo can now examine the same brushstrokes as someone in Moscow."

**Global Reach**

The virtual tour has already facilitated international connections:
- Collaboration with museums in New York and London
- Virtual artist exchanges with galleries in Asia
- Educational partnerships with universities worldwide

**Sustainability Benefits**

The digital initiative supports the gallery's sustainability goals:
- Reduced carbon footprint from virtual visits
- Decreased need for physical reproductions
- Extended reach without expanding physical space

**Call to Action**

Experience the virtual tour today at virtual.modernartgallery.com. Whether you're an art enthusiast, student, or professional, this immersive experience offers something for everyone.

**About the Modern Art Gallery**

Founded in 1995, the Modern Art Gallery has been a leader in making contemporary art accessible to diverse audiences. This virtual tour represents our ongoing commitment to innovation and inclusivity in art presentation.`,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB2aXJ0dWFsJTIwdG91cnxlbnwxfHx8fDE3Njc3MDI0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-20',
      category: 'Technology'
    },
    {
      id: 10,
      title: 'Free Community Art Workshops: From Canvas to Creativity for All Ages',
      excerpt: 'Inclusive art education program offers workshops for everyone, from toddlers to seniors, with professional instruction and all materials provided.',
      content: `**COMMUNITY ART INITIATIVE LAUNCHES**

**Moscow, January 22, 2025** - The Modern Art Gallery today announced the launch of its comprehensive community art workshop series, designed to make art education accessible to people of all ages, backgrounds, and skill levels.

**Program Philosophy**

"Art should be for everyone, not just the privileged few," says community outreach director Olga Ivanova. "Our workshops break down barriers and create spaces where people can discover their creativity, regardless of age, income, or previous experience."

**Workshop Offerings**

The program features four distinct tracks:

**Young Artists (Ages 4-12)**
- "Little Picassos": Introduction to basic techniques
- "Nature Explorers": Outdoor sketching and observation
- "Color Adventures": Mixing paints and understanding color theory
- "Storytelling Through Art": Creating narratives with visual elements

**Teen Program (Ages 13-17)**
- "Urban Art": Street art techniques and graffiti basics
- "Digital Creativity": Introduction to digital art tools
- "Portrait Mastery": Drawing and painting human faces
- "Social Issues": Art as activism and expression

**Adult Workshops (Ages 18+)**
- "Oil Painting Fundamentals": Traditional techniques for beginners
- "Watercolor Wonders": Exploring transparency and fluidity
- "Sculpture Basics": Working with clay and basic forms
- "Mixed Media Magic": Combining different art forms

**Senior Artists (Ages 55+)**
- "Memory & Art": Using art to explore personal history
- "Gentle Watercolors": Low-pressure creative expression
- "Digital Photography": Capturing life's moments
- "Art & Wellness": Using creativity for stress relief

**Schedule and Format**

- **Frequency**: Weekly sessions every Saturday
- **Duration**: 2 hours per session
- **Group Size**: Maximum 15 participants per workshop
- **Format**: Hands-on instruction with individual attention
- **Materials**: All supplies included in the program fee

**Pricing Structure**

The gallery has implemented an inclusive pricing model:
- **Full Price**: 500 RUB per workshop
- **Concession**: 300 RUB (students, seniors, unemployed)
- **Family Rate**: 1,200 RUB (up to 4 family members)
- **Free**: Available for those experiencing financial hardship

**Instructor Team**

Workshops are led by professional artists and educators:
- **Maria Petrova**: Children's art specialist, 15 years experience
- **Alexei Sokolov**: Digital art and technology integration
- **Elena Kuznetsova**: Traditional painting techniques
- **Dr. Ivan Morozov**: Art therapy and wellness applications

**Venue and Facilities**

Sessions take place in the gallery's dedicated education wing:
- Bright, well-ventilated studios with natural light
- Individual work stations with proper ventilation
- Professional-grade art supplies and equipment
- Accessible facilities for participants with disabilities
- On-site café for breaks and refreshments

**Registration Process**

- **Online Registration**: Available at modernartgallery.com/workshops
- **Phone Registration**: Call (495) 123-4567 during business hours
- **Walk-in Registration**: Available at the gallery reception
- **Group Bookings**: Special rates for schools and community groups

**Quality Assurance**

Each workshop includes:
- **Pre-workshop Assessment**: Matching participants with appropriate skill levels
- **Progress Tracking**: Individual feedback and improvement plans
- **Take-home Materials**: Participants keep their artwork and basic supplies
- **Follow-up Support**: Access to online resources and continued learning

**Community Impact**

The program has already shown significant community benefits:
- **Accessibility**: Served over 500 participants in the first month
- **Inclusivity**: 40% of participants from underrepresented communities
- **Skill Development**: 85% of participants report increased confidence
- **Community Building**: Created networks of local artists and art enthusiasts

**Success Stories**

Participant testimonials highlight the program's impact:

*"My 8-year-old daughter was shy and withdrawn. After joining the Little Picassos workshop, she's become confident and expressive. Art has given her a voice." - Anna M., parent*

*"As a senior, I thought my creative days were behind me. This program proved me wrong. I'm now creating art daily and have made wonderful friends." - Viktor K., 68*

**Partnerships and Support**

The program is supported by:
- Local government arts funding
- Corporate sponsorships from art supply companies
- Community foundation grants
- Volunteer artist mentors

**Future Expansion**

Based on initial success, the gallery plans to expand:
- After-school programs for local schools
- Weekend family workshops
- Online components for remote participation
- Advanced master classes for program graduates

**Join the Community**

Whether you're a curious beginner or an experienced artist looking to explore new techniques, the Modern Art Gallery's community workshop series offers something for everyone. Register today and discover the artist within!

**Contact Information**

For more information or to register:
- Website: modernartgallery.com/workshops
- Phone: (495) 123-4567
- Email: education@modernartgallery.com
- Address: 15 Tverskaya Street, Moscow

Art is for everyone. Come create with us!`,
      image: 'https://images.unsplash.com/photo-1688216130114-4b5245d70fcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB3b3Jrc2hvcCUyMGNvbW11bml0eXxlbnwxfHx8fDE3Njc3MDI0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-22',
      category: 'Workshop'
    },
    {
      id: 11,
      title: 'Rare Book Exhibition: "Artists\' Voices" Opens February 10th',
      excerpt: 'Explore the intersection of art and literature through rare books, monographs, and artist publications spanning centuries.',
      content: `**LITERARY ARTS CROSSOVER EXHIBITION**

**Moscow, January 25, 2025** - The Modern Art Gallery will open "Artists' Voices," a groundbreaking exhibition exploring the intersection of visual art and literature through rare books, artist monographs, and experimental publications.

**Exhibition Concept**

"Artists' Voices" examines how artists have used the written word to document, contextualize, and expand their visual practice. The exhibition features over 200 items spanning five centuries, from illuminated manuscripts to contemporary digital publications.

**Curatorial Approach**

Curator Dr. Maria Ivanova explains the exhibition's philosophy: "Artists have always been writers. From da Vinci's notebooks to contemporary artists' books, the written word has been integral to artistic practice. This exhibition reveals those hidden narratives."

**Key Sections**

**Historical Foundations (15th-18th Centuries)**
- Leonardo da Vinci's anatomical drawings with handwritten annotations
- Dürer's theoretical writings on perspective and proportion
- Russian icon painters' manuals from the 17th century

**Romantic Era (19th Century)**
- William Blake's illuminated books combining text and image
- Caspar David Friedrich's landscape theories
- Ivan Shishkin's writings on Russian forest painting

**Modernist Revolution (Early 20th Century)**
- Kandinsky's "Concerning the Spiritual in Art"
- Malevich's Suprematist manifestos
- Russian avant-garde artists' books and periodicals

**Contemporary Expressions (Late 20th-21st Century)**
- Marina Volkov's digital notebooks
- Alexander Petrov's interactive artist statements
- Elena Sokolova's sculptural books

**Rare Highlights**

The exhibition includes several extraordinary items:
- **First Edition**: Leonardo da Vinci's "Treatise on Painting" (1651)
- **Unique Manuscript**: Shishkin's personal sketchbook with nature observations
- **Artist Book**: Marina Volkov's "Digital Dreams" - a book that changes when scanned by smartphone
- **Interactive Installation**: Alexander Petrov's "Text as Sculpture" - words formed from recycled books

**Interactive Elements**

Modern technology brings historical texts to life:
- **Augmented Reality**: Point your phone at manuscripts to see animated interpretations
- **Audio Guides**: Artists reading their own writings
- **Touch Screens**: Explore digital facsimiles of fragile documents
- **Live Demonstrations**: Calligraphy and bookbinding workshops

**Conservation Challenges**

Many items require special conservation measures:
- Climate-controlled cases for parchment documents
- UV-filtered lighting to prevent fading
- Custom supports for three-dimensional artists' books
- Digital preservation of ephemeral publications

**Educational Programming**

The exhibition inspires extensive educational activities:
- **Artist-Writer Workshops**: Combining visual and written expression
- **Book Arts Classes**: Traditional and contemporary bookmaking
- **Literary Analysis Sessions**: Exploring text in visual art
- **Writer-Artist Dialogues**: Contemporary practitioners discuss their processes

**Publication**

Accompanying the exhibition is a 300-page catalog featuring:
- Full-color reproductions of all exhibited items
- Scholarly essays by international experts
- Artist interviews and writings
- Technical conservation reports

**International Context**

"Artists' Voices" contributes to the growing field of book arts:
- Parallels contemporary Russian practice with global movements
- Highlights Russia's rich tradition of artist-writers
- Explores the future of text in digital art

**Venue and Accessibility**

The exhibition occupies the gallery's special collections wing:
- Wheelchair accessible throughout
- Magnification devices for detailed viewing
- Quiet spaces for contemplation
- Audio descriptions for visually impaired visitors

**Opening Celebration**

The exhibition opens with a gala event featuring:
- Readings by contemporary Russian authors
- Performances combining text and movement
- Book launch for the exhibition catalog
- Networking reception for collectors and scholars

**Duration and Tickets**

- **Opening**: February 10, 2025, 7:00 PM
- **Duration**: February 10 - May 15, 2025
- **Hours**: Tuesday-Sunday, 10:00 AM - 6:00 PM
- **Admission**: 300 RUB general, 150 RUB students/seniors
- **Group Tours**: Available by appointment

**Critical Anticipation**

Early reviews suggest the exhibition will be a major cultural event:
- "A masterful exploration of the written word in visual art" - Art Newspaper
- "Reveals hidden narratives that enrich our understanding of artistic practice" - The Guardian
- "Technologically innovative while honoring historical traditions" - Artforum

**Legacy and Impact**

"Artists' Voices" will influence how we think about artists' books and the relationship between text and image. It promises to become a landmark exhibition in the field of book arts and visual literature.

**About the Curator**

Dr. Maria Ivanova is the gallery's senior curator of special collections and a leading expert in artists' books. Her previous exhibitions include "The Russian Avant-Garde" and "Contemporary Artists' Books."

For more information and to reserve tickets for the opening, visit modernartgallery.com/artistsvoices or call (495) 123-4567.`,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBib29rJTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3Njc3MDI0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-25',
      category: 'Exhibition'
    },
    {
      id: 12,
      title: 'Annual Student Art Competition Winners Announced: Celebrating Young Talent',
      excerpt: 'Outstanding young artists recognized for their innovative work exploring contemporary themes and traditional techniques.',
      content: `**YOUTH ART EXCELLENCE RECOGNIZED**

**Moscow, January 28, 2025** - The Modern Art Gallery today announced the winners of its prestigious Annual Student Art Competition, celebrating the creativity and vision of young artists from across Russia and beyond.

**Competition Overview**

The 2024 competition received over 500 entries from students aged 16-25, representing 47 different institutions including art academies, universities, and independent art programs. Works were judged on originality, technical skill, conceptual depth, and artistic vision.

**Grand Prize Winner**

**First Place: "Urban Dreams" by Sophia Chen**
- **Medium**: Digital mixed media
- **Institution**: Moscow State University, Digital Arts Program
- **Prize**: 50,000 RUB scholarship + solo exhibition opportunity

Sophia's winning piece explores the intersection of technology and human consciousness through a series of interactive digital landscapes. "Urban Dreams represents how our cities shape our subconscious," Chen explains. "The work combines traditional Chinese landscape painting aesthetics with contemporary digital techniques."

**Second Place: "Nature's Resilience" by Marcus Johnson**
- **Medium**: Photography and installation
- **Institution**: St. Petersburg State Art Academy
- **Prize**: 30,000 RUB scholarship + gallery internship

Johnson's powerful series documents the regrowth of forests after wildfires, using large-format photography combined with collected artifacts from burned sites. The installation creates an immersive experience that confronts viewers with nature's capacity for renewal.

**Third Place: "Cultural Fusion" by Aisha Patel**
- **Medium**: Mixed media textile art
- **Institution**: Independent study, supported by community arts program
- **Prize**: 20,000 RUB scholarship + workshop series

Patel's work weaves together traditional Indian textile techniques with contemporary urban motifs, creating tapestries that explore themes of cultural identity and migration.

**Honorable Mentions**

The jury also recognized exceptional work from:
- **"Digital Identity" by Alexei Petrov** - Innovative use of AI in portraiture
- **"Memory Fragments" by Olga Ivanova** - Mixed media exploration of family history
- **"Future Cities" by David Kim** - Architectural models reimagining urban spaces

**Jury and Selection Process**

The competition was judged by a distinguished panel:
- **Marina Volkov** - Contemporary artist and gallery resident
- **Dr. Elena Sokolova** - Art historian and curator
- **Prof. Alexander Chen** - Digital arts specialist
- **Maria Ivanova** - Youth arts program director

Judges evaluated submissions based on:
- Technical proficiency and innovation
- Conceptual depth and originality
- Emotional impact and communication
- Craftsmanship and presentation

**Exhibition and Public Display**

All winning works will be exhibited in the gallery's main space from February 15 - March 15, 2025. The exhibition will include:
- Interactive elements allowing visitors to engage with digital works
- Artist talks and Q&A sessions
- Educational materials about each artist's process
- Voting for "People's Choice" award

**Impact and Opportunities**

Beyond financial prizes, winners receive:
- Professional portfolio reviews
- Mentorship from established artists
- Exhibition opportunities
- Networking with art world professionals
- Coverage in art publications

**Demographics and Trends**

Analysis of this year's entries reveals interesting trends:
- **Digital Media Dominance**: 45% of entries used digital or new media techniques
- **Social Issues Focus**: 60% of works addressed contemporary social concerns
- **Diverse Representation**: Participants from 15 different countries
- **Gender Balance**: 52% female, 48% male participants

**Community Response**

The competition has generated significant community interest:
- Over 10,000 visitors to the exhibition preview
- Extensive media coverage in art and education publications
- Increased enrollment in participating art programs
- Growing interest from corporate sponsors

**Future of the Competition**

Building on this year's success, the gallery plans:
- Expanded international participation for 2025
- New categories for emerging technologies
- Increased prize pool and opportunities
- Online voting and virtual exhibition components

**Educational Value**

Beyond recognizing talent, the competition serves important educational purposes:
- Encourages artistic development among young people
- Provides exposure to diverse artistic approaches
- Builds confidence and professional skills
- Fosters dialogue between emerging and established artists

**Sponsor Recognition**

The competition is made possible through generous support from:
- Russian Ministry of Culture
- Corporate sponsors including art supply companies
- Private foundations dedicated to arts education
- Individual donors passionate about nurturing young talent

**Celebration Event**

Winners will be celebrated at a gala event featuring:
- Awards ceremony with keynote speeches
- Exhibition opening with live music
- Networking reception for artists and supporters
- Special viewing of winning works

**Contact and Information**

For more information about the competition or to view winning works:
- Website: modernartgallery.com/studentcompetition
- Exhibition: February 15 - March 15, 2025
- Hours: Tuesday-Sunday, 10:00 AM - 6:00 PM

The Modern Art Gallery congratulates all participants and looks forward to seeing how these talented young artists shape the future of contemporary art.`,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBjb21wZXRpdGlvbiUyMHdpbm5lcnN8ZW58MXx8fHwxNzY3NzAyNDA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-01-28',
      category: 'Announcement'
    },
    {
      id: 13,
      title: 'State-of-the-Art Conservation Lab Opens: Preserving Art for Future Generations',
      excerpt: 'New facility combines cutting-edge technology with traditional techniques to ensure the longevity of our cultural heritage.',
      content: `**PRESERVATION INNOVATION UNVEILED**

**Moscow, February 1, 2025** - The Modern Art Gallery today inaugurated its new Conservation Laboratory, a 500-square-meter facility that combines cutting-edge technology with traditional craftsmanship to preserve the gallery's collection for future generations.

**Facility Overview**

The new lab represents a 15 million USD investment in art preservation:
- **Climate-Controlled Environment**: Temperature and humidity maintained at precise levels
- **Clean Rooms**: ISO 7 certified spaces for sensitive conservation work
- **Advanced Imaging**: Multi-spectral imaging and 3D scanning capabilities
- **Scientific Analysis**: Gas chromatography, X-ray fluorescence, and infrared spectroscopy

**Key Departments**

**Paintings Conservation**
- Specialized easel painting treatment stations
- UV-protected lighting systems
- Solvent extraction and varnish removal equipment
- Canvas stretching and lining facilities

**Sculpture and Objects**
- Bronze casting and patina restoration
- Stone conservation with laser cleaning technology
- Metal treatment and corrosion prevention
- Three-dimensional scanning for digital archiving

**Paper and Textiles**
- Archival storage solutions
- Paper conservation with enzyme treatments
- Textile cleaning and stabilization
- Digital reproduction capabilities

**Digital Preservation**
- High-resolution scanning up to 1200 DPI
- Color management and calibration systems
- Long-term digital storage solutions
- Virtual reality documentation

**Staff and Expertise**

The lab employs 12 full-time conservators and technicians:
- **Chief Conservator**: Dr. Anna Petrova, 20 years experience
- **Paintings Specialist**: Maria Ivanova, former Hermitage Museum conservator
- **Digital Specialist**: Dr. Alexei Sokolov, PhD in digital humanities
- **Training Coordinator**: Elena Kuznetsova, responsible for intern programs

**Technological Innovations**

The lab features several groundbreaking technologies:
- **AI-Powered Analysis**: Machine learning algorithms detect restoration needs
- **Nanotechnology Treatments**: Microscopic conservation solutions
- **Laser Cleaning**: Precise removal of surface contaminants
- **3D Printing**: Reproduction of missing elements

**Current Projects**

The lab is currently working on several major projects:
- **Shishkin Landscape Restoration**: Removing 19th-century varnish layers
- **Digital Archive Migration**: Converting analog records to digital format
- **Climate Impact Study**: Researching environmental effects on artworks
- **Training Program Development**: Creating certification courses for conservators

**Public Access and Education**

While most conservation work occurs behind closed doors, the lab offers public engagement:
- **Guided Tours**: Monthly public tours of the facility
- **Open Lab Days**: Annual events showcasing conservation techniques
- **Educational Programs**: Workshops on art preservation for schools
- **Online Resources**: Virtual tours and conservation demonstrations

**Sustainability Focus**

The lab incorporates eco-friendly practices:
- **Energy-Efficient Systems**: LED lighting and smart climate control
- **Recycled Materials**: Sustainable sourcing for storage and display
- **Waste Reduction**: Minimal-waste conservation techniques
- **Green Chemistry**: Environmentally safe cleaning solutions

**International Collaboration**

The facility fosters global partnerships:
- **Exchange Programs**: Conservator exchanges with international institutions
- **Joint Research**: Collaborative projects with universities worldwide
- **Standards Development**: Contributing to international conservation guidelines
- **Emergency Response**: Part of global network for art disaster response

**Success Metrics**

Since opening, the lab has achieved:
- **95% Success Rate**: Successful treatment of complex conservation cases
- **Zero Accidents**: Perfect safety record in high-risk chemical environments
- **International Recognition**: Featured in conservation journals worldwide
- **Educational Impact**: Trained 200+ students in conservation techniques

**Future Expansion**

Plans for the lab include:
- **Expanded Digital Capabilities**: AI-driven predictive conservation
- **Mobile Unit**: Portable conservation for traveling exhibitions
- **Research Wing**: Dedicated space for conservation science research
- **Public Gallery**: Exhibition space for "before and after" conservation stories

**Community Impact**

The conservation lab serves the broader art community:
- **Local Artist Support**: Free consultations for working artists
- **Collection Care Training**: Programs for other museums and galleries
- **Public Awareness**: Education about the importance of art preservation
- **Cultural Heritage Protection**: Safeguarding Russia's artistic legacy

**Funding and Support**

The lab was made possible through:
- **Government Grants**: Ministry of Culture funding
- **Private Donations**: Support from art collectors and foundations
- **Corporate Partnerships**: Sponsorship from conservation technology companies
- **International Grants**: Funding from UNESCO and European cultural programs

**Vision for the Future**

Director Dr. Vladimir Kuznetsov articulated the lab's mission: "Our collection represents centuries of human creativity and cultural achievement. This lab ensures that future generations can continue to learn from and be inspired by these masterpieces. Conservation isn't just about preservation—it's about keeping art alive."

**Visit and Learn**

The conservation lab welcomes visitors through scheduled tours. To arrange a visit or learn more about conservation services, contact conservation@modernartgallery.com or call (495) 123-4567.

**About Art Conservation**

Art conservation is a multidisciplinary field combining art history, chemistry, and craftsmanship. The Modern Art Gallery's new lab represents the cutting edge of this vital practice, ensuring that our cultural heritage remains vibrant and accessible for generations to come.`,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBjb25zZXJ2YXRpb24lMjBsYWJ8ZW58MXx8fHwxNzY3NzAyNDA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-02-01',
      category: 'Facility'
    },
    {
      id: 14,
      title: 'International Artist Exchange: Brazilian Sculptor Maria Santos Joins Gallery Residency',
      excerpt: 'São Paulo-based artist brings fresh perspectives to Moscow art scene through innovative sculptural practice.',
      content: `**GLOBAL ARTISTIC DIALOGUE EXPANDS**

**Moscow, February 3, 2025** - The Modern Art Gallery welcomes Brazilian sculptor Maria Santos as the first participant in its new International Artist Exchange Program, marking an exciting expansion of global artistic dialogue and cross-cultural collaboration.

**Artist Background**

Maria Santos, born in São Paulo in 1978, has established herself as one of Brazil's most innovative contemporary sculptors. Her work explores the intersection of natural forms, urban decay, and human resilience, often using recycled industrial materials to create large-scale installations.

**Previous Achievements**

Santos' career highlights include:
- **Bienal de São Paulo**: Featured artist in 2019 and 2021
- **Museu de Arte Moderna**: Major retrospective in 2022
- **International Residencies**: Programs in Berlin, New York, and Mexico City
- **Awards**: Winner of the prestigious Brazilian Contemporary Art Prize (2020)

**Moscow Project**

During her three-month residency (March 1 - May 31, 2025), Santos will create a new body of work titled "Northern Lights," exploring themes of migration, adaptation, and cultural transformation. The project will include:

- **Large-Scale Installation**: A 15-meter interactive sculpture in the gallery's central atrium
- **Site-Specific Works**: Pieces responding to Moscow's urban and architectural context
- **Collaborative Elements**: Workshops with local artists and community engagement
- **Performance Component**: Live elements involving audience participation

**Cultural Exchange Goals**

The exchange program aims to:
- **Foster Dialogue**: Connect Russian and Brazilian artistic traditions
- **Build Networks**: Create lasting professional relationships between artists
- **Expand Perspectives**: Introduce new techniques and viewpoints to local audiences
- **Promote Diversity**: Highlight underrepresented voices in contemporary art

**Program Structure**

The International Artist Exchange Program includes:
- **Three-Month Residency**: Dedicated studio space and living accommodations
- **Professional Support**: Translation services, visa assistance, and cultural orientation
- **Exhibition Opportunity**: Guaranteed solo exhibition at residency conclusion
- **Community Engagement**: Public workshops, lectures, and artist talks
- **Documentation**: Professional photography and video of the creative process

**Opening Exhibition**

Santos' work will be unveiled in a major exhibition opening May 20, 2025, featuring:
- **Installation Walkthrough**: Guided tours of the main installation
- **Artist Talk**: Santos discussing her process and inspirations
- **Reception**: Networking event with Moscow art community
- **Publication**: Exhibition catalog with essays and documentation

**Educational Components**

The residency includes extensive educational programming:
- **Master Classes**: Sculpture techniques workshops for local artists
- **School Programs**: Age-appropriate sessions for students
- **Community Workshops**: Free sessions for general public
- **Online Content**: Virtual workshops for remote participants

**Cultural Context**

Santos' work provides a bridge between Brazilian and Russian artistic traditions:
- **Brazilian Influence**: Tropical forms, recycled materials, social commentary
- **Russian Context**: Adaptation to colder climate, urban transformation themes
- **Universal Themes**: Migration, identity, environmental concerns

**Sustainability Focus**

The project incorporates eco-friendly practices:
- **Recycled Materials**: Using Moscow's industrial waste in sculptures
- **Local Sourcing**: Collaborating with Russian material suppliers
- **Educational Component**: Workshops on sustainable art practices

**Media and Documentation**

The residency will be extensively documented:
- **Process Journal**: Daily updates on Santos' creative development
- **Video Series**: Behind-the-scenes footage and interviews
- **Photography**: Professional documentation of all works
- **Social Media**: Live updates and audience engagement

**Community Impact**

The program has already generated significant local interest:
- **Media Coverage**: Features in major Russian and Brazilian publications
- **Academic Partnerships**: Collaborations with Moscow art universities
- **Community Support**: Local businesses sponsoring program elements
- **International Attention**: Inquiries from other galleries interested in similar exchanges

**Future Plans**

This inaugural exchange sets the stage for future international collaborations:
- **Reciprocal Programs**: Russian artists traveling to Brazil
- **Expanded Network**: Partnerships with galleries in other countries
- **Diverse Representation**: Artists from Africa, Asia, and Latin America
- **Thematic Focus**: Future exchanges centered on specific artistic themes

**Artist Statement**

Maria Santos shares her excitement: "Moscow represents a new chapter in my artistic journey. The city's blend of historical grandeur and modern energy inspires me to explore new dimensions in my work. I'm particularly interested in how Russian artists have historically engaged with nature and space—concepts that resonate deeply with my own practice."

**Gallery Perspective**

Gallery director Dr. Vladimir Kuznetsov emphasizes the program's significance: "In an increasingly interconnected world, art must transcend borders. Maria Santos brings fresh perspectives that will enrich our community and expand our understanding of contemporary sculpture."

**Public Engagement**

Throughout the residency, the public can follow Santos' progress through:
- **Open Studio Hours**: Weekly opportunities to visit her workspace
- **Progress Updates**: Regular gallery exhibitions of work-in-progress
- **Social Media**: Live updates and audience polls
- **Community Events**: Free public programs and discussions

**Contact Information**

For more information about the International Artist Exchange Program:
- Website: modernartgallery.com/exchange
- Email: exchange@modernartgallery.com
- Phone: (495) 123-4567

The Modern Art Gallery is proud to welcome Maria Santos and looks forward to the creative dialogue her presence will inspire. This exchange represents not just an artistic collaboration, but a celebration of global cultural diversity and shared human creativity.`,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBleGNoYW5nZSUyMHByb2dyYW18ZW58MXx8fHwxNzY3NzAyNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-02-03',
      category: 'Program'
    },
    {
      id: 15,
      title: 'Spring Exhibition Preview: "Emerging Voices" Showcases 12 New Artists',
      excerpt: 'Exclusive preview event offers first look at groundbreaking exhibition featuring Russia\'s most promising young contemporary artists.',
      content: `**YOUNG TALENT TAKES CENTER STAGE**

**Moscow, February 5, 2025** - The Modern Art Gallery will host an exclusive preview of "Emerging Voices," its most ambitious exhibition of young contemporary artists to date, featuring 12 emerging talents who are reshaping the Russian art landscape.

**Exhibition Overview**

"Emerging Voices" presents a comprehensive survey of contemporary Russian art by artists under 35, exploring how new generations engage with identity, technology, social change, and global connectivity.

**Featured Artists**

The exhibition showcases work by:

**Digital Pioneers**
- **Sophia Chen**: AI-generated landscapes exploring climate anxiety
- **Marcus Johnson**: Virtual reality installations examining digital identity
- **Aisha Patel**: Interactive web art addressing cultural hybridity

**Traditional Innovators**
- **Elena Petrova**: Large-scale oil paintings reimagining Russian folklore
- **Alexei Sokolov**: Sculptural installations using industrial materials
- **Maria Ivanova**: Textile works combining traditional and contemporary techniques

**Social Commentators**
- **David Kim**: Photography series documenting urban transformation
- **Olga Morozova**: Performance art exploring gender and technology
- **Ivan Petrov**: Mixed media works addressing environmental concerns

**Cross-Disciplinary Artists**
- **Anna Kuznetsova**: Sound installations with visual components
- **Sergei Volkov**: Architectural models exploring future cities
- **Tatiana Sokolova**: Bio-art using living materials

**Curatorial Vision**

Curator Dr. Maria Ivanova explains the exhibition's approach: "These artists represent the future of Russian art—not as a continuation of tradition, but as a dynamic engagement with global contemporary practice. Each voice brings unique perspectives shaped by their generation's experiences."

**Thematic Sections**

The exhibition is organized into thematic galleries:

**"Digital Natives"**
Interactive installations exploring technology's impact on human connection

**"Urban Chronicles"**
Works examining contemporary urban life and social transformation

**"Environmental Dialogues"**
Art addressing climate change and human-nature relationships

**"Identity Explorations"**
Pieces investigating personal and cultural identity in a globalized world

**Installation Highlights**

Standout works include:
- Chen's "Climate Dreams": An AI system generating infinite landscape variations
- Johnson's "Identity Fragments": VR experience exploring multiple selves
- Patel's "Cultural Code": Interactive website blending Russian and Indian traditions
- Petrova's "Folklore Reimagined": 3-meter canvas depicting modern fairy tales

**Technical Innovation**

The exhibition incorporates cutting-edge presentation methods:
- **Augmented Reality Labels**: Scan codes to access artist interviews and process documentation
- **Interactive Elements**: Touchscreens allowing visitors to influence digital works
- **Audio Guides**: Multi-language audio with artist voices and curatorial insights
- **Live Streaming**: Selected installations stream to online audiences

**Educational Programming**

Extensive educational components include:
- **Artist Talks**: Weekly sessions with featured artists
- **Workshops**: Hands-on sessions exploring techniques used in the exhibition
- **School Programs**: Age-appropriate tours and activities
- **Online Resources**: Virtual exhibition guide and artist interviews

**Preview Event Details**

The exclusive preview (March 15, 6:00-9:00 PM) features:
- **Cocktail Reception**: Networking with artists and collectors
- **Guided Tours**: Curator-led walkthroughs of the exhibition
- **Artist Presentations**: Short talks by participating artists
- **Live Performances**: Special performances by performance artists
- **Silent Auction**: Opportunity to bid on selected works

**VIP Experience**

Preview attendees enjoy:
- **Early Access**: Private viewing before public opening
- **Meet & Greet**: Personal introductions to artists
- **Exclusive Content**: Behind-the-scenes insights and process documentation
- **Premium Amenities**: Gourmet catering and premium beverages

**Public Opening**

The exhibition opens to the general public March 20, 2025, and runs through May 15, 2025.

**Ticket Information**

- **Preview Event**: 500 USD (includes reception and auction access)
- **Regular Admission**: 300 RUB
- **Student/Senior**: 150 RUB
- **Family Pass**: 600 RUB (2 adults + 2 children)

**Media Coverage**

The exhibition has garnered significant advance attention:
- **Art Newspaper**: "A bold showcase of Russia's artistic future"
- **The Guardian**: "Emerging Voices captures the energy of a new generation"
- **Artforum**: "Technologically savvy and socially engaged"

**Market Impact**

Several works are already generating collector interest:
- **Secondary Market Potential**: Early indications suggest strong resale value
- **Institutional Interest**: Museums inquiring about loans and acquisitions
- **Commercial Galleries**: International dealers seeking representation opportunities

**Legacy and Influence**

"Emerging Voices" aims to:
- **Launch Careers**: Provide national exposure for promising artists
- **Shape Discourse**: Influence conversations about contemporary Russian art
- **Build Community**: Create networks among young artists and supporters
- **Set Precedents**: Establish new standards for emerging artist exhibitions

**Sustainability Initiatives**

The exhibition incorporates eco-friendly practices:
- **Digital Components**: Reduced need for physical materials
- **Recycled Materials**: Sustainable sourcing for installations
- **Carbon Offsetting**: Gallery offsets emissions from international travel
- **Educational Focus**: Programming on sustainable art practices

**International Context**

While focused on Russian artists, the exhibition connects to global conversations:
- **Global Themes**: Artists engage with universal contemporary issues
- **International Techniques**: Incorporation of global art movements and technologies
- **Cross-Cultural Dialogue**: Works exploring migration and cultural exchange

**Future Opportunities**

The exhibition creates pathways for participants:
- **Representation**: Gallery offers contracts with interested artists
- **Exhibition Opportunities**: Invitations to international shows
- **Funding Support**: Applications for grants and residencies
- **Professional Development**: Mentorship and career guidance

**Community Engagement**

Public programs ensure broad accessibility:
- **Open Studios**: Artists working in view of visitors during open hours
- **Community Feedback**: Visitor response stations influencing future programming
- **Social Media Integration**: Live updates and audience interaction
- **Diverse Outreach**: Programs in multiple languages and formats

**Conclusion**

"Emerging Voices" represents a pivotal moment for contemporary Russian art, showcasing the creativity, innovation, and social consciousness of a new generation. This exhibition not only celebrates artistic achievement but also points toward the future of cultural expression in an increasingly complex world.

**For More Information**

- Website: modernartgallery.com/emergingvoices
- Preview Registration: events@modernartgallery.com
- General Inquiries: info@modernartgallery.com
- Phone: (495) 123-4567

The Modern Art Gallery invites you to join us in celebrating the voices that will shape the future of art.`,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBlbWVyZ2luZyUyMGFydGlzdHN8ZW58MXx8fHwxNzY3NzAyNDExfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-02-05',
      category: 'Preview'
    }
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      // ignore persistence errors
    }
  }, [cart]);
  
  const [artworks, setArtworks] = useState<Artwork[]>([
    // Exhibition 1 - Abstract Horizons by Marina Volkov
    {
      id: 1,
      title: 'Crimson Dawn',
      year: '2025',
      medium: 'Oil on canvas',
      dimensions: '120 × 150 cm',
      image: 'https://images.unsplash.com/photo-1676579526746-acba9b0eef80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwcGFpbnRpbmclMjBhYnN0cmFjdHxlbnwxfHx8fDE3Njc3MDIzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 850,
      exhibitionId: 1
    },
    {
      id: 2,
      title: 'Azure Dreams',
      year: '2025',
      medium: 'Oil on canvas',
      dimensions: '100 × 120 cm',
      image: 'https://images.unsplash.com/photo-1590968802291-f1e1f86cde34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcnQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3Njc3MDIzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 720,
      exhibitionId: 1
    },
    {
      id: 3,
      title: 'Golden Silence',
      year: '2024',
      medium: 'Oil on canvas',
      dimensions: '90 × 110 cm',
      image: 'https://images.unsplash.com/photo-1667980898743-fcfe470b7d2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwYWludGluZyUyMGNhbnZhc3xlbnwxfHx8fDE3Njc2OTQ1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 650,
      exhibitionId: 1
    },
    // Exhibition 2 - Contemporary Visions by Alexander Petrov
    {
      id: 4,
      title: 'Digital Realm',
      year: '2025',
      medium: 'Mixed media installation',
      dimensions: 'Variable dimensions',
      image: 'https://images.unsplash.com/photo-1723242017405-5018aa65ddad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcnQlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzY3NTgyNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      exhibitionId: 2
    },
    {
      id: 5,
      title: 'Memory Traces',
      year: '2024',
      medium: 'Mixed media',
      dimensions: '150 × 200 cm',
      image: 'https://images.unsplash.com/photo-1767294274414-5e1e6c3974e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMHNwYWNlfGVufDF8fHx8MTc2NzcwMTUxOHww&ixlib=rb-4.1.0&q=80&w=1080',
      price: 1200,
      exhibitionId: 2
    },
    // Exhibition 3 - Sculptural Forms by Elena Sokolova
    {
      id: 6,
      title: 'Metamorphosis',
      year: '2025',
      medium: 'Bronze',
      dimensions: '180 × 90 × 60 cm',
      image: 'https://images.unsplash.com/photo-1617596223856-a17ba0eac50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc2N1bHB0dXJlfGVufDF8fHx8MTc2NzY5MjY1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      price: 2500,
      exhibitionId: 3
    }
  ]);
  
  const handleNavigate = (page: string, id?: number, type?: 'painting' | 'shop') => {
    setCurrentPage(page as Page);
    if (page === 'detail' && id) {
      setSelectedPaintingId(id);
    }
    if (page === 'news-detail' && id) {
      setSelectedNewsId(id);
    }
    if (page === 'exhibition-detail' && id) {
      setSelectedExhibitionId(id);
    }
    if (page === 'artist-detail' && id) {
      setSelectedArtistId(id);
    }
    if (page === 'shop-detail' && id) {
      setSelectedShopItemId(id);
    }
    if (page === 'shop') {
      setSelectedShopItemId(null);
    }
    if (page === 'checkout' && id) {
      if (type === 'shop') {
        setSelectedShopItemId(id);
        setSelectedPaintingId(null);
      } else {
        setSelectedPaintingId(id);
        setSelectedShopItemId(null);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleAddNews = (newsItem: Omit<News, 'id'>) => {
    const newNews = {
      ...newsItem,
      id: Math.max(...news.map(n => n.id), 0) + 1
    };
    setNews([...news, newNews]);
  };

  const handleEditNews = (updatedNews: News) => {
    setNews(news.map(n => n.id === updatedNews.id ? updatedNews : n));
  };

  const handleDeleteNews = (id: number) => {
    setNews(news.filter(n => n.id !== id));
  };

  const handleAddExhibition = (exhibition: Omit<Exhibition, 'id'>) => {
    const newExhibition = {
      ...exhibition,
      id: Math.max(...exhibitions.map(e => e.id), 0) + 1
    };
    setExhibitions([...exhibitions, newExhibition]);
  };

  const handleEditExhibition = (updatedExhibition: Exhibition) => {
    setExhibitions(exhibitions.map(e => e.id === updatedExhibition.id ? updatedExhibition : e));
  };

  const handleDeleteExhibition = (id: number) => {
    setExhibitions(exhibitions.filter(e => e.id !== id));
  };

  const handleAddArtist = (artist: Omit<Artist, 'id'>) => {
    const newArtist = {
      ...artist,
      id: Math.max(...artists.map(a => a.id), 0) + 1
    };
    setArtists([...artists, newArtist]);
  };

  const handleEditArtist = (updatedArtist: Artist) => {
    setArtists(artists.map(a => a.id === updatedArtist.id ? updatedArtist : a));
  };

  const handleDeleteArtist = (id: number) => {
    setArtists(artists.filter(a => a.id !== id));
  };

  const handleAddShopItem = (item: Omit<ShopItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Math.max(...shopItems.map(i => i.id), 0) + 1
    };
    setShopItems([...shopItems, newItem]);
  };

  const handleEditShopItem = (updatedItem: ShopItem) => {
    setShopItems(shopItems.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const handleDeleteShopItem = (id: number) => {
    setShopItems(shopItems.filter(i => i.id !== id));
  };

  const addToCart = (item: any, type: 'painting' | 'shop') => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id && cartItem.type === type);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id && cartItem.type === type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, type, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId: number, type: 'painting' | 'shop', newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, type);
      return;
    }
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.item.id === itemId && cartItem.type === type
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  };

  const removeFromCart = (itemId: number, type: 'painting' | 'shop') => {
    setCart(prevCart => prevCart.filter(cartItem => !(cartItem.item.id === itemId && cartItem.type === type)));
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const isAdminPage = currentPage.startsWith('admin-') && currentPage !== 'admin-login';
  
  // Try to fetch exchange rates from Nazbank API if configured (optional)
  const fetchNazbankRates = async () => {
    try {
      const url = (import.meta.env.VITE_NAZBANK_API_URL as string) || '';
      const key = (import.meta.env.VITE_NAZBANK_API_KEY as string) || '';
      if (!url) return;
      const res = await fetch(url, { headers: key ? { 'Authorization': `Bearer ${key}` } : {} });
      const data = await res.json();
      // Expected shape: data.rates.EUR, data.rates.KZT (adjust if API differs)
      if (data?.rates) {
        setRates({ EUR: data.rates.EUR || rates.EUR, KZT: data.rates.KZT || rates.KZT });
      }
    } catch (e) {
      // ignore, keep defaults
    }
  };

  // fetch on mount
  useState(() => { fetchNazbankRates(); return; });

  const convertPrice = (priceUSD: number) => {
    if (currency === 'USD') return priceUSD;
    if (currency === 'EUR') return +(priceUSD * rates.EUR);
    if (currency === 'KZT') return +(priceUSD * rates.KZT);
    return priceUSD;
  };
  
  const renderPage = () => {
    // If user is trying to access an admin page but is not authenticated,
    // show the simple client-side login first.
    if (isAdminPage && !isAuthenticated) {
      return (
        <AdminLogin
          onLogin={(token) => {
            setIsAuthenticated(true);
            handleNavigate('admin-paintings');
          }}
          onCancel={() => handleNavigate('home')}
        />
      );
    }
    switch (currentPage) {
      case 'home':
      case 'contact':
        return <Home onNavigate={handleNavigate} news={news} exhibitions={exhibitions} />;
      case 'exhibitions':
        return <Exhibitions exhibitions={exhibitions} onNavigate={handleNavigate} />;
      case 'exhibition-detail':
        return (
          <ExhibitionDetail 
            exhibition={exhibitions.find(e => e.id === selectedExhibitionId)} 
            artworks={artworks.filter(a => a.exhibitionId === selectedExhibitionId)}
            onNavigate={handleNavigate} 
          />
        );
      case 'artists':
        return <Artists exhibitions={exhibitions} onNavigate={handleNavigate} />;
      case 'artist-detail':
        return selectedArtistId ? (
          <Artists 
            exhibitions={exhibitions}
            selectedArtistId={selectedArtistId}
            onNavigate={handleNavigate} 
            addToCart={addToCart}
          />
        ) : (
          <Artists exhibitions={exhibitions} onNavigate={handleNavigate} />
        );
      case 'shop':
        return <Shop items={shopItems} onNavigate={handleNavigate} addToCart={addToCart} />;
      case 'shop-detail':
        return selectedShopItemId ? (
          <ShopDetail 
            shopItemId={selectedShopItemId} 
            shopItems={shopItems} 
            onNavigate={handleNavigate}
            addToCart={addToCart}
          />
        ) : (
          <Shop items={shopItems} onNavigate={handleNavigate} addToCart={addToCart} />
        );
      case 'catalog':
        return <Catalog onPaintingClick={(id) => handleNavigate('detail', id)} />;
      case 'detail':
        return selectedPaintingId ? (
          <PaintingDetail paintingId={selectedPaintingId} onNavigate={handleNavigate} addToCart={addToCart} />
        ) : (
          <Catalog onPaintingClick={(id) => handleNavigate('detail', id)} />
        );
      case 'checkout':
        return <Checkout cart={cart} onNavigate={handleNavigate} clearCart={clearCart} />;
      case 'cart':
        return (
          <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
            <h1 className="page-title">Shopping Cart</h1>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty.</p>
                <button className="btn" onClick={() => handleNavigate('shop')}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart
                    .filter((cartItem) => cartItem && cartItem.item)
                    .map((cartItem) => (
                    <div key={`${cartItem.item.id}-${cartItem.type}`} className="cart-item">
                      <img 
                        src={cartItem.item.image || cartItem.item.imageUrl} 
                        alt={cartItem.item.title} 
                        className="cart-item-image" 
                      />
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{cartItem.item.title}</h3>
                        <p className="cart-item-artist">{cartItem.item.artist}</p>
                        <p className="cart-item-price">
                          ${
                            (cartItem.item.priceUSD || cartItem.item.price || 0)
                              .toLocaleString('en-US')
                          }
                        </p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.type, cartItem.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="quantity-display">{cartItem.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.type, cartItem.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(cartItem.item.id, cartItem.type)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Total:</span>
                  <span>
                    ${cart
                      .filter((item) => item && item.item)
                      .reduce((sum, item) => {
                        const price = item.item.priceUSD || item.item.price || 0;
                        return sum + price * item.quantity;
                      }, 0)
                      .toLocaleString('en-US')}
                  </span>
                </div>
                <div className="cart-actions">
                  <button className="btn btn-secondary" onClick={() => handleNavigate('shop')}>
                    Continue Shopping
                  </button>
                  <button className="btn" onClick={() => handleNavigate('checkout')}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        );
      case 'news':
        return <NewsList news={news} onNavigate={handleNavigate} />;
      case 'news-detail':
        return <NewsDetail news={news.find(n => n.id === selectedNewsId)} onNavigate={handleNavigate} />;
      case 'admin-paintings':
        return <PaintingsManager />;
      case 'admin-orders':
        return <OrdersManager />;
      case 'admin-news':
        return <NewsManager />;
      case 'admin-exhibitions':
        return <ExhibitionsManager />;
      case 'admin-artists':
        return <ArtistsManager />;
      case 'admin-shop':
        return <ShopManager />;
      case 'admin-currency':
        return <CurrencySettings />;
      default:
        return <Home onNavigate={handleNavigate} news={news} exhibitions={exhibitions} />;
    }
  };
  
  return (
    <div className="app-wrapper">
      {isAdminPage ? (
        <AdminHeader currentPage={currentPage} onNavigate={handleNavigate} onLogout={() => { setIsAuthenticated(false); handleNavigate('home'); }} />
      ) : currentPage === 'home' ? (
        <Header currentPage={currentPage} onNavigate={handleNavigate} cart={cart} currency={currency} onCurrencyChange={setCurrency} />
      ) : (
        <HeaderDark currentPage={currentPage} onNavigate={handleNavigate} cart={cart} currency={currency} onCurrencyChange={setCurrency} />
      )}
      
      <main className="main-content">
        {renderPage()}
      </main>
      
      {!isAdminPage && <Footer />}
    </div>
  );
}