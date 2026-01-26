-- Begilda Gallery SQLite Schema
-- Enable foreign keys (must be run per connection)
PRAGMA foreign_keys = ON;

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  nationality TEXT,
  born TEXT,
  specialty TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Paintings table
CREATE TABLE IF NOT EXISTS paintings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id TEXT REFERENCES artists(id) ON DELETE SET NULL,
  artist_name TEXT,
  year INTEGER,
  price INTEGER,
  price_usd REAL,
  price_eur REAL,
  image TEXT,
  image_url TEXT,
  description TEXT,
  dimensions TEXT,
  size TEXT,
  medium TEXT,
  category TEXT,
  availability INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  exhibition_only INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  location TEXT,
  dates TEXT,
  description TEXT,
  image TEXT,
  image_url TEXT,
  status TEXT CHECK(status IN ('current', 'upcoming', 'past')) DEFAULT 'upcoming',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Exhibition-Painting junction table (many-to-many)
CREATE TABLE IF NOT EXISTS exhibition_paintings (
  exhibition_id TEXT NOT NULL REFERENCES exhibitions(id) ON DELETE CASCADE,
  painting_id TEXT NOT NULL REFERENCES paintings(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (exhibition_id, painting_id)
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  date TEXT,
  category TEXT,
  instagram_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Shop items table
CREATE TABLE IF NOT EXISTS shop_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  price INTEGER,
  price_usd REAL,
  price_eur REAL,
  image TEXT,
  image_url TEXT,
  category TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Pickup points table
CREATE TABLE IF NOT EXISTS pickup_points (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  working_hours TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  delivery_type TEXT CHECK(delivery_type IN ('pickup', 'delivery')),
  pickup_point_id TEXT REFERENCES pickup_points(id) ON DELETE SET NULL,
  country TEXT,
  postal_code TEXT,
  city TEXT,
  address TEXT,
  total_amount INTEGER,
  status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Order items table (normalized from nested array)
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_type TEXT CHECK(item_type IN ('painting', 'shop')) NOT NULL,
  title TEXT,
  price INTEGER,
  quantity INTEGER DEFAULT 1
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_paintings_artist_id ON paintings(artist_id);
CREATE INDEX IF NOT EXISTS idx_paintings_category ON paintings(category);
CREATE INDEX IF NOT EXISTS idx_paintings_availability ON paintings(availability);
CREATE INDEX IF NOT EXISTS idx_paintings_featured ON paintings(featured);
CREATE INDEX IF NOT EXISTS idx_exhibitions_status ON exhibitions(status);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_pickup_points_active ON pickup_points(is_active);
