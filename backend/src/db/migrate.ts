import { prisma } from './client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

interface JsonArtist {
  id: number | string;
  name: string;
  bio?: string;
  image?: string;
  nationality?: string;
  born?: string;
}

interface JsonPainting {
  id: string;
  title: string;
  artist?: string;
  year?: number;
  price?: number;
  priceUSD?: number;
  priceEUR?: number;
  image?: string;
  imageUrl?: string;
  description?: string;
  dimensions?: string;
  size?: string;
  medium?: string;
  category?: string;
  availability?: boolean;
  featured?: boolean;
  exhibitionOnly?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface JsonExhibition {
  id: string;
  title: string;
  artist?: string;
  location?: string;
  dates?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  status?: 'current' | 'upcoming' | 'past';
  paintingIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface JsonNews {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  date?: string;
  category?: string;
  instagramUrl?: string;
  createdAt?: string;
}

interface JsonShopItem {
  id: string;
  title: string;
  artist?: string;
  price?: number;
  priceUSD?: number;
  priceEUR?: number;
  image?: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface JsonPickupPoint {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  workingHours?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface JsonOrderItem {
  itemId: string | number;
  itemType: 'painting' | 'shop';
  title?: string;
  price?: number;
  quantity?: number;
}

interface JsonOrder {
  id: string;
  fullName?: string;
  email: string;
  phone?: string;
  deliveryType?: 'pickup' | 'delivery';
  pickupPoint?: string;
  country?: string;
  postalCode?: string;
  city?: string;
  address?: string;
  items?: JsonOrderItem[];
  totalAmount?: number;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: string;
}

function readJSON<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T[];
  } catch {
    console.log(`  No ${filename} found, skipping...`);
    return [];
  }
}

async function migrate(): Promise<void> {
  console.log('Starting migration from JSON to database...\n');

  // Backup by creating timestamped backup in data folder
  const dbPath = path.join(DATA_DIR, 'gallery.db');
  if (fs.existsSync(dbPath)) {
    const backupPath = `${dbPath}.backup.${Date.now()}`;
    fs.copyFileSync(dbPath, backupPath);
    console.log(`Backed up existing database to ${path.basename(backupPath)}`);
  }

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.exhibitionPainting.deleteMany();
  await prisma.exhibition.deleteMany();
  await prisma.painting.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.news.deleteMany();
  await prisma.shopItem.deleteMany();
  await prisma.pickupPoint.deleteMany();
  console.log('Database cleared\n');

  // Migrate artists (convert numeric IDs to UUIDs)
  const artists = readJSON<JsonArtist>('artists.json');
  const artistIdMap = new Map<string | number, string>(); // old ID/name -> new UUID

  if (artists.length) {
    for (const artist of artists) {
      const newId = uuidv4();
      artistIdMap.set(artist.id, newId);
      artistIdMap.set(artist.name, newId); // Also map by name for painting references

      await prisma.artist.create({
        data: {
          id: newId,
          name: artist.name,
          bio: artist.bio ?? null,
          image: artist.image ?? null,
          nationality: artist.nationality ?? null,
          born: artist.born ?? null,
        },
      });
    }
    console.log(`Migrated ${artists.length} artists`);
  }

  // Migrate paintings
  const paintings = readJSON<JsonPainting>('paintings.json');
  if (paintings.length) {
    for (const p of paintings) {
      const artistId = p.artist ? (artistIdMap.get(p.artist) ?? null) : null;
      
      await prisma.painting.create({
        data: {
          id: p.id,
          title: p.title,
          artistName: p.artist ?? null,
          artistId: artistId,
          year: p.year != null ? String(p.year) : null,
          price: p.price ?? null,
          priceUsd: p.priceUSD ?? null,
          priceEur: p.priceEUR ?? null,
          image: p.image ?? null,
          imageUrl: p.imageUrl ?? null,
          description: p.description ?? null,
          dimensions: p.dimensions ?? null,
          size: p.size ?? null,
          medium: p.medium ?? null,
          category: p.category ?? null,
          availability: p.availability !== false,
          featured: p.featured ?? false,
          exhibitionOnly: p.exhibitionOnly ?? false,
          ...(p.createdAt && { createdAt: new Date(p.createdAt) }),
          ...(p.updatedAt && { updatedAt: new Date(p.updatedAt) }),
        },
      });
    }
    console.log(`Migrated ${paintings.length} paintings`);
  }

  // Migrate exhibitions with paintingIds
  const exhibitions = readJSON<JsonExhibition>('exhibitions.json');
  if (exhibitions.length) {
    for (const e of exhibitions) {
      await prisma.exhibition.create({
        data: {
          id: e.id,
          title: e.title,
          artist: e.artist ?? null,
          location: e.location ?? null,
          dates: e.dates ?? null,
          description: e.description ?? null,
          image: e.image ?? null,
          imageUrl: e.imageUrl ?? null,
          status: e.status ?? 'upcoming',
          ...(e.createdAt && { createdAt: new Date(e.createdAt) }),
          ...(e.updatedAt && { updatedAt: new Date(e.updatedAt) }),
          paintings: {
            create: e.paintingIds?.map((paintingId, index) => ({
              paintingId,
              displayOrder: index,
            })) ?? [],
          },
        },
      });
    }
    console.log(`Migrated ${exhibitions.length} exhibitions`);
  }

  // Migrate pickup points (before orders, since orders reference them)
  const pickupPoints = readJSON<JsonPickupPoint>('pickupPoints.json');
  if (pickupPoints.length) {
    for (const p of pickupPoints) {
      await prisma.pickupPoint.create({
        data: {
          id: p.id,
          name: p.name,
          address: p.address ?? null,
          city: p.city ?? null,
          phone: p.phone ?? null,
          workingHours: p.workingHours ?? null,
          isActive: p.isActive !== false,
          ...(p.createdAt && { createdAt: new Date(p.createdAt) }),
          ...(p.updatedAt && { updatedAt: new Date(p.updatedAt) }),
        },
      });
    }
    console.log(`Migrated ${pickupPoints.length} pickup points`);
  }

  // Migrate orders with items
  const orders = readJSON<JsonOrder>('orders.json');
  if (orders.length) {
    for (const o of orders) {
      await prisma.order.create({
        data: {
          id: o.id,
          fullName: o.fullName ?? null,
          email: o.email,
          phone: o.phone ?? null,
          deliveryType: o.deliveryType ?? null,
          pickupPointId: o.pickupPoint ?? null,
          country: o.country ?? null,
          postalCode: o.postalCode ?? null,
          city: o.city ?? null,
          address: o.address ?? null,
          totalAmount: o.totalAmount ?? null,
          status: o.status ?? 'pending',
          ...(o.createdAt && { createdAt: new Date(o.createdAt) }),
          items: {
            create: (o.items ?? []).map((item) => ({
              itemId: String(item.itemId),
              itemType: item.itemType,
              title: item.title ?? null,
              price: item.price ?? null,
              quantity: item.quantity ?? 1,
            })),
          },
        },
      });
    }
    console.log(`Migrated ${orders.length} orders`);
  }

  // Migrate news
  const news = readJSON<JsonNews>('news.json');
  if (news.length) {
    for (const n of news) {
      await prisma.news.create({
        data: {
          id: n.id,
          title: n.title,
          excerpt: n.excerpt ?? null,
          content: n.content ?? null,
          image: n.image ?? null,
          date: n.date ?? null,
          category: n.category ?? null,
          instagramUrl: n.instagramUrl ?? null,
          ...(n.createdAt && { createdAt: new Date(n.createdAt) }),
        },
      });
    }
    console.log(`Migrated ${news.length} news articles`);
  }

  // Migrate shop items
  const shop = readJSON<JsonShopItem>('shop.json');
  if (shop.length) {
    for (const s of shop) {
      await prisma.shopItem.create({
        data: {
          id: s.id,
          title: s.title,
          artist: s.artist ?? null,
          price: s.price ?? null,
          priceUsd: s.priceUSD ?? null,
          priceEur: s.priceEUR ?? null,
          image: s.image ?? null,
          imageUrl: s.imageUrl ?? null,
          category: s.category ?? null,
          description: s.description ?? null,
          ...(s.createdAt && { createdAt: new Date(s.createdAt) }),
          ...(s.updatedAt && { updatedAt: new Date(s.updatedAt) }),
        },
      });
    }
    console.log(`Migrated ${shop.length} shop items`);
  }

  console.log('\n✅ Migration completed successfully!');

  // Print summary
  console.log('\nRecord counts:');
  const artistCount = await prisma.artist.count();
  const paintingCount = await prisma.painting.count();
  const exhibitionCount = await prisma.exhibition.count();
  const newsCount = await prisma.news.count();
  const shopCount = await prisma.shopItem.count();
  const pickupCount = await prisma.pickupPoint.count();
  const orderCount = await prisma.order.count();
  const orderItemCount = await prisma.orderItem.count();
  const exhibitionPaintingCount = await prisma.exhibitionPainting.count();

  console.log(`  artists: ${artistCount}`);
  console.log(`  paintings: ${paintingCount}`);
  console.log(`  exhibitions: ${exhibitionCount}`);
  console.log(`  exhibition_paintings: ${exhibitionPaintingCount}`);
  console.log(`  news: ${newsCount}`);
  console.log(`  shop_items: ${shopCount}`);
  console.log(`  pickup_points: ${pickupCount}`);
  console.log(`  orders: ${orderCount}`);
  console.log(`  order_items: ${orderItemCount}`);

  await prisma.$disconnect();
}

migrate().catch(console.error);
