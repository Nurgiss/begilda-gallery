import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Создание папки для загрузок
const UPLOADS_DIR = path.join(__dirname, 'uploads');
await fs.mkdir(UPLOADS_DIR, { recursive: true });

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены!'));
    }
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Статические файлы для загруженных изображений
app.use('/uploads', express.static(UPLOADS_DIR));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const PAINTINGS_FILE = path.join(DATA_DIR, 'paintings.json');
const EXHIBITIONS_FILE = path.join(DATA_DIR, 'exhibitions.json');
const ARTISTS_FILE = path.join(DATA_DIR, 'artists.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const SHOP_FILE = path.join(DATA_DIR, 'shop.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Initialize data directory
async function initDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize files if they don't exist
    const files = [
      { path: PAINTINGS_FILE, data: [] },
      { path: EXHIBITIONS_FILE, data: [] },
      { path: ARTISTS_FILE, data: [] },
      { path: NEWS_FILE, data: [] },
      { path: SHOP_FILE, data: [] },
      { path: ORDERS_FILE, data: [] }
    ];
    
    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.data, null, 2));
      }
    }
  } catch (error) {
    console.error('Error initializing data directory:', error);
  }
}

// Helper functions for file operations
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

async function writeData(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// ==================== UPLOAD API ====================

// POST upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ==================== PAINTINGS API ====================

// GET all paintings
app.get('/api/paintings', async (req, res) => {
  const paintings = await readData(PAINTINGS_FILE);
  res.json(paintings);
});

// GET painting by ID
app.get('/api/paintings/:id', async (req, res) => {
  const paintings = await readData(PAINTINGS_FILE);
  const painting = paintings.find(p => p.id === req.params.id);
  
  if (painting) {
    res.json(painting);
  } else {
    res.status(404).json({ error: 'Painting not found' });
  }
});

// POST create painting
app.post('/api/paintings', async (req, res) => {
  const paintings = await readData(PAINTINGS_FILE);
  const newPainting = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  paintings.push(newPainting);
  const success = await writeData(PAINTINGS_FILE, paintings);
  
  if (success) {
    res.status(201).json(newPainting);
  } else {
    res.status(500).json({ error: 'Failed to create painting' });
  }
});

// PUT update painting
app.put('/api/paintings/:id', async (req, res) => {
  const paintings = await readData(PAINTINGS_FILE);
  const index = paintings.findIndex(p => p.id === req.params.id);
  
  if (index !== -1) {
    paintings[index] = {
      ...paintings[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeData(PAINTINGS_FILE, paintings);
    
    if (success) {
      res.json(paintings[index]);
    } else {
      res.status(500).json({ error: 'Failed to update painting' });
    }
  } else {
    res.status(404).json({ error: 'Painting not found' });
  }
});

// DELETE painting
app.delete('/api/paintings/:id', async (req, res) => {
  const paintings = await readData(PAINTINGS_FILE);
  const filtered = paintings.filter(p => p.id !== req.params.id);
  
  if (filtered.length < paintings.length) {
    const success = await writeData(PAINTINGS_FILE, filtered);
    
    if (success) {
      res.json({ message: 'Painting deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete painting' });
    }
  } else {
    res.status(404).json({ error: 'Painting not found' });
  }
});

// ==================== EXHIBITIONS API ====================

app.get('/api/exhibitions', async (req, res) => {
  const exhibitions = await readData(EXHIBITIONS_FILE);
  res.json(exhibitions);
});

app.get('/api/exhibitions/:id', async (req, res) => {
  const exhibitions = await readData(EXHIBITIONS_FILE);
  const exhibition = exhibitions.find(e => e.id === req.params.id);
  
  if (exhibition) {
    res.json(exhibition);
  } else {
    res.status(404).json({ error: 'Exhibition not found' });
  }
});

app.post('/api/exhibitions', async (req, res) => {
  const exhibitions = await readData(EXHIBITIONS_FILE);
  const newExhibition = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  exhibitions.push(newExhibition);
  const success = await writeData(EXHIBITIONS_FILE, exhibitions);
  
  if (success) {
    res.status(201).json(newExhibition);
  } else {
    res.status(500).json({ error: 'Failed to create exhibition' });
  }
});

app.put('/api/exhibitions/:id', async (req, res) => {
  const exhibitions = await readData(EXHIBITIONS_FILE);
  const index = exhibitions.findIndex(e => e.id === req.params.id);
  
  if (index !== -1) {
    exhibitions[index] = {
      ...exhibitions[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeData(EXHIBITIONS_FILE, exhibitions);
    
    if (success) {
      res.json(exhibitions[index]);
    } else {
      res.status(500).json({ error: 'Failed to update exhibition' });
    }
  } else {
    res.status(404).json({ error: 'Exhibition not found' });
  }
});

app.delete('/api/exhibitions/:id', async (req, res) => {
  const exhibitions = await readData(EXHIBITIONS_FILE);
  const filtered = exhibitions.filter(e => e.id !== req.params.id);
  
  if (filtered.length < exhibitions.length) {
    const success = await writeData(EXHIBITIONS_FILE, filtered);
    
    if (success) {
      res.json({ message: 'Exhibition deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete exhibition' });
    }
  } else {
    res.status(404).json({ error: 'Exhibition not found' });
  }
});

// ==================== ARTISTS API ====================

app.get('/api/artists', async (req, res) => {
  const artists = await readData(ARTISTS_FILE);
  res.json(artists);
});

app.get('/api/artists/:id', async (req, res) => {
  const artists = await readData(ARTISTS_FILE);
  const artist = artists.find(a => a.id === req.params.id);
  
  if (artist) {
    res.json(artist);
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

app.post('/api/artists', async (req, res) => {
  const artists = await readData(ARTISTS_FILE);
  const newArtist = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  artists.push(newArtist);
  const success = await writeData(ARTISTS_FILE, artists);
  
  if (success) {
    res.status(201).json(newArtist);
  } else {
    res.status(500).json({ error: 'Failed to create artist' });
  }
});

app.put('/api/artists/:id', async (req, res) => {
  const artists = await readData(ARTISTS_FILE);
  const index = artists.findIndex(a => a.id === req.params.id);
  
  if (index !== -1) {
    artists[index] = {
      ...artists[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeData(ARTISTS_FILE, artists);
    
    if (success) {
      res.json(artists[index]);
    } else {
      res.status(500).json({ error: 'Failed to update artist' });
    }
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

app.delete('/api/artists/:id', async (req, res) => {
  const artists = await readData(ARTISTS_FILE);
  const filtered = artists.filter(a => a.id !== req.params.id);
  
  if (filtered.length < artists.length) {
    const success = await writeData(ARTISTS_FILE, filtered);
    
    if (success) {
      res.json({ message: 'Artist deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete artist' });
    }
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

// ==================== NEWS API ====================

app.get('/api/news', async (req, res) => {
  const news = await readData(NEWS_FILE);
  res.json(news);
});

app.get('/api/news/:id', async (req, res) => {
  const news = await readData(NEWS_FILE);
  const article = news.find(n => n.id === req.params.id);
  
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: 'News article not found' });
  }
});

app.post('/api/news', async (req, res) => {
  const news = await readData(NEWS_FILE);
  const newArticle = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  news.push(newArticle);
  const success = await writeData(NEWS_FILE, news);
  
  if (success) {
    res.status(201).json(newArticle);
  } else {
    res.status(500).json({ error: 'Failed to create news article' });
  }
});

app.put('/api/news/:id', async (req, res) => {
  const news = await readData(NEWS_FILE);
  const index = news.findIndex(n => n.id === req.params.id);
  
  if (index !== -1) {
    news[index] = {
      ...news[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeData(NEWS_FILE, news);
    
    if (success) {
      res.json(news[index]);
    } else {
      res.status(500).json({ error: 'Failed to update news article' });
    }
  } else {
    res.status(404).json({ error: 'News article not found' });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  const news = await readData(NEWS_FILE);
  const filtered = news.filter(n => n.id !== req.params.id);
  
  if (filtered.length < news.length) {
    const success = await writeData(NEWS_FILE, filtered);
    
    if (success) {
      res.json({ message: 'News article deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete news article' });
    }
  } else {
    res.status(404).json({ error: 'News article not found' });
  }
});

// ==================== SHOP API ====================

app.get('/api/shop', async (req, res) => {
  const shop = await readData(SHOP_FILE);
  res.json(shop);
});

app.get('/api/shop/:id', async (req, res) => {
  const shop = await readData(SHOP_FILE);
  const item = shop.find(s => s.id === req.params.id);
  
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Shop item not found' });
  }
});

app.post('/api/shop', async (req, res) => {
  const shop = await readData(SHOP_FILE);
  const newItem = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  shop.push(newItem);
  const success = await writeData(SHOP_FILE, shop);
  
  if (success) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Failed to create shop item' });
  }
});

app.put('/api/shop/:id', async (req, res) => {
  const shop = await readData(SHOP_FILE);
  const index = shop.findIndex(s => s.id === req.params.id);
  
  if (index !== -1) {
    shop[index] = {
      ...shop[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeData(SHOP_FILE, shop);
    
    if (success) {
      res.json(shop[index]);
    } else {
      res.status(500).json({ error: 'Failed to update shop item' });
    }
  } else {
    res.status(404).json({ error: 'Shop item not found' });
  }
});

app.delete('/api/shop/:id', async (req, res) => {
  const shop = await readData(SHOP_FILE);
  const filtered = shop.filter(s => s.id !== req.params.id);
  
  if (filtered.length < shop.length) {
    const success = await writeData(SHOP_FILE, filtered);
    
    if (success) {
      res.json({ message: 'Shop item deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete shop item' });
    }
  } else {
    res.status(404).json({ error: 'Shop item not found' });
  }
});

// ==================== ORDERS API ====================

app.get('/api/orders', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  res.json(orders);
});

app.get('/api/orders/:id', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  const order = orders.find(o => o.id === req.params.id);
  
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.post('/api/orders', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  const newOrder = {
    id: uuidv4(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  const success = await writeData(ORDERS_FILE, orders);
  
  if (success) {
    res.status(201).json(newOrder);
  } else {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === req.params.id);
  
  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeData(ORDERS_FILE, orders);
    
    if (success) {
      res.json(orders[index]);
    } else {
      res.status(500).json({ error: 'Failed to update order' });
    }
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  const orders = await readData(ORDERS_FILE);
  const filtered = orders.filter(o => o.id !== req.params.id);
  
  if (filtered.length < orders.length) {
    const success = await writeData(ORDERS_FILE, filtered);
    
    if (success) {
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Begilda Gallery API is running' });
});

// Start server
async function startServer() {
  await initDataDir();
  
  app.listen(PORT, () => {
    console.log(`🎨 Begilda Gallery API server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer();
