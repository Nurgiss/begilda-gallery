import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'gallery.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

interface JsonArtist {
  id: number | string;
  name: string;
  bio?: string;
  image?: string;
  nationality?: string;
  born?: string;
  specialty?: string;
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
  console.log('Starting migration from JSON to SQLite...\n');

  // Backup existing database if it exists
  if (fs.existsSync(DB_PATH)) {
    const backupPath = `${DB_PATH}.backup.${Date.now()}`;
    fs.renameSync(DB_PATH, backupPath);
    console.log(`Backed up existing database to ${path.basename(backupPath)}`);
  }

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Create new database
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Initialize schema
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);
  console.log('Schema created\n');

  // Migrate artists (convert numeric IDs to UUIDs)
  const artists = readJSON<JsonArtist>('artists.json');
  const artistIdMap = new Map<string | number, string>(); // old ID/name -> new UUID

  if (artists.length) {
    const insertArtist = db.prepare(`
      INSERT INTO artists (id, name, bio, image, nationality, born, specialty)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const artist of artists) {
      const newId = uuidv4();
      artistIdMap.set(artist.id, newId);
      artistIdMap.set(artist.name, newId); // Also map by name for painting references

      insertArtist.run(
        newId,
        artist.name,
        artist.bio ?? null,
        artist.image ?? null,
        artist.nationality ?? null,
        artist.born ?? null,
        artist.specialty ?? null
      );
    }
    console.log(`Migrated ${artists.length} artists`);
  }

  // Migrate paintings
  const paintings = readJSON<JsonPainting>('paintings.json');
  if (paintings.length) {
    const insertPainting = db.prepare(`
      INSERT INTO paintings (
        id, title, artist_name, artist_id, year, price, price_usd, price_eur,
        image, image_url, description, dimensions, size, medium, category,
        availability, featured, exhibition_only, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of paintings) {
      const artistId = p.artist ? (artistIdMap.get(p.artist) ?? null) : null;
      insertPainting.run(
        p.id,
        p.title,
        p.artist ?? null,
        artistId,
        p.year ?? null,
        p.price ?? null,
        p.priceUSD ?? null,
        p.priceEUR ?? null,
        p.image ?? null,
        p.imageUrl ?? null,
        p.description ?? null,
        p.dimensions ?? null,
        p.size ?? null,
        p.medium ?? null,
        p.category ?? null,
        p.availability !== false ? 1 : 0,
        p.featured ? 1 : 0,
        p.exhibitionOnly ? 1 : 0,
        p.createdAt ?? null,
        p.updatedAt ?? null
      );
    }
    console.log(`Migrated ${paintings.length} paintings`);
  }

  // Migrate exhibitions with paintingIds
  const exhibitions = readJSON<JsonExhibition>('exhibitions.json');
  if (exhibitions.length) {
    const insertExhibition = db.prepare(`
      INSERT INTO exhibitions (id, title, artist, location, dates, description, image, image_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertExhibitionPainting = db.prepare(
      'INSERT OR IGNORE INTO exhibition_paintings (exhibition_id, painting_id, display_order) VALUES (?, ?, ?)'
    );

    for (const e of exhibitions) {
      insertExhibition.run(
        e.id,
        e.title,
        e.artist ?? null,
        e.location ?? null,
        e.dates ?? null,
        e.description ?? null,
        e.image ?? null,
        e.imageUrl ?? null,
        e.status ?? 'upcoming',
        e.createdAt ?? null,
        e.updatedAt ?? null
      );

      if (e.paintingIds?.length) {
        e.paintingIds.forEach((paintingId, index) => {
          try {
            insertExhibitionPainting.run(e.id, paintingId, index);
          } catch (err) {
            console.warn(`  Warning: Could not link painting ${paintingId} to exhibition ${e.id}`);
          }
        });
      }
    }
    console.log(`Migrated ${exhibitions.length} exhibitions`);
  }

  // Migrate pickup points (before orders, since orders reference them)
  const pickupPoints = readJSON<JsonPickupPoint>('pickupPoints.json');
  if (pickupPoints.length) {
    const insertPickup = db.prepare(`
      INSERT INTO pickup_points (id, name, address, city, phone, working_hours, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of pickupPoints) {
      insertPickup.run(
        p.id,
        p.name,
        p.address ?? null,
        p.city ?? null,
        p.phone ?? null,
        p.workingHours ?? null,
        p.isActive !== false ? 1 : 0,
        p.createdAt ?? null,
        p.updatedAt ?? null
      );
    }
    console.log(`Migrated ${pickupPoints.length} pickup points`);
  }

  // Migrate orders with items
  const orders = readJSON<JsonOrder>('orders.json');
  if (orders.length) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, full_name, email, phone, delivery_type, pickup_point_id,
        country, postal_code, city, address, total_amount, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertOrderItem = db.prepare(
      'INSERT INTO order_items (order_id, item_id, item_type, title, price, quantity) VALUES (?, ?, ?, ?, ?, ?)'
    );

    for (const o of orders) {
      insertOrder.run(
        o.id,
        o.fullName ?? null,
        o.email,
        o.phone ?? null,
        o.deliveryType ?? null,
        o.pickupPoint ?? null,
        o.country ?? null,
        o.postalCode ?? null,
        o.city ?? null,
        o.address ?? null,
        o.totalAmount ?? null,
        o.status ?? 'pending',
        o.createdAt ?? null
      );

      for (const item of o.items ?? []) {
        insertOrderItem.run(
          o.id,
          String(item.itemId),
          item.itemType,
          item.title ?? null,
          item.price ?? null,
          item.quantity ?? 1
        );
      }
    }
    console.log(`Migrated ${orders.length} orders`);
  }

  // Migrate news
  const news = readJSON<JsonNews>('news.json');
  if (news.length) {
    const insertNews = db.prepare(`
      INSERT INTO news (id, title, excerpt, content, image, date, category, instagram_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const n of news) {
      insertNews.run(
        n.id,
        n.title,
        n.excerpt ?? null,
        n.content ?? null,
        n.image ?? null,
        n.date ?? null,
        n.category ?? null,
        n.instagramUrl ?? null,
        n.createdAt ?? null
      );
    }
    console.log(`Migrated ${news.length} news articles`);
  }

  // Migrate shop items
  const shop = readJSON<JsonShopItem>('shop.json');
  if (shop.length) {
    const insertShop = db.prepare(`
      INSERT INTO shop_items (id, title, artist, price, price_usd, price_eur, image, image_url, category, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of shop) {
      insertShop.run(
        s.id,
        s.title,
        s.artist ?? null,
        s.price ?? null,
        s.priceUSD ?? null,
        s.priceEUR ?? null,
        s.image ?? null,
        s.imageUrl ?? null,
        s.category ?? null,
        s.description ?? null,
        s.createdAt ?? null,
        s.updatedAt ?? null
      );
    }
    console.log(`Migrated ${shop.length} shop items`);
  }

  db.close();

  console.log('\n✅ Migration completed successfully!');
  console.log(`Database created at: ${DB_PATH}`);

  // Print summary
  console.log('\nRecord counts:');
  const verifyDb = new Database(DB_PATH);
  const tables = ['artists', 'paintings', 'exhibitions', 'news', 'shop_items', 'pickup_points', 'orders', 'order_items', 'exhibition_paintings'];
  for (const table of tables) {
    const count = verifyDb.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
    console.log(`  ${table}: ${count.count}`);
  }
  verifyDb.close();
}

migrate().catch(console.error);
