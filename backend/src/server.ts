import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import repositories
import * as artistsRepo from './repositories/artists.js';
import * as paintingsRepo from './repositories/paintings.js';
import * as exhibitionsRepo from './repositories/exhibitions.js';
import * as newsRepo from './repositories/news.js';
import * as shopRepo from './repositories/shop.js';
import * as ordersRepo from './repositories/orders.js';
import * as pickupPointsRepo from './repositories/pickupPoints.js';

import { prisma } from './db/client.js';
import { sendOrderConfirmationEmail } from './services/email.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Static files for uploaded images
app.use('/uploads', express.static(UPLOADS_DIR));

// Extend Express Request type
interface AuthenticatedRequest extends Request {
  user?: { username: string; role: string };
}

// JWT Authentication Middleware
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }
    req.user = user as { username: string; role: string };
    next();
  });
};

// ==================== AUTH API ====================

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' });
      return;
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      console.error('ADMIN_PASSWORD_HASH not configured in .env');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    if (username.trim() !== adminUsername) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn'],
    });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==================== UPLOAD API ====================

app.post('/api/upload', authenticateToken, upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ==================== PAINTINGS API ====================

app.get('/api/paintings', async (_req: Request, res: Response) => {
  const paintings = await paintingsRepo.getAll();
  res.json(paintings);
});

app.get('/api/paintings/:id', async (req: Request, res: Response) => {
  const painting = await paintingsRepo.getById(String(req.params.id));

  if (painting) {
    res.json(painting);
  } else {
    res.status(404).json({ error: 'Painting not found' });
  }
});

app.post('/api/paintings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const painting = await paintingsRepo.create(req.body);
    res.status(201).json(painting);
  } catch (error) {
    console.error('Create painting error:', error);
    res.status(500).json({ error: 'Failed to create painting' });
  }
});

app.put('/api/paintings/:id', authenticateToken, async (req: Request, res: Response) => {
  const painting = await paintingsRepo.update(String(req.params.id), req.body);

  if (painting) {
    res.json(painting);
  } else {
    res.status(404).json({ error: 'Painting not found' });
  }
});

app.delete('/api/paintings/:id', authenticateToken, async (req: Request, res: Response) => {
  const deleted = await paintingsRepo.remove(String(req.params.id));

  if (deleted) {
    res.json({ message: 'Painting deleted successfully' });
  } else {
    res.status(404).json({ error: 'Painting not found' });
  }
});

// ==================== EXHIBITIONS API ====================

app.get('/api/exhibitions', async (_req: Request, res: Response) => {
  const exhibitions = await exhibitionsRepo.getAll();
  res.json(exhibitions);
});

app.get('/api/exhibitions/:id', async (req: Request, res: Response) => {
  const exhibition = await exhibitionsRepo.getById(String(req.params.id));

  if (exhibition) {
    res.json(exhibition);
  } else {
    res.status(404).json({ error: 'Exhibition not found' });
  }
});

app.post('/api/exhibitions', authenticateToken, async (req: Request, res: Response) => {
  try {
    const exhibition = await exhibitionsRepo.create(req.body);
    res.status(201).json(exhibition);
  } catch (error) {
    console.error('Create exhibition error:', error);
    res.status(500).json({ error: 'Failed to create exhibition' });
  }
});

app.put('/api/exhibitions/:id', authenticateToken, async (req: Request, res: Response) => {
  const exhibition = await exhibitionsRepo.update(String(req.params.id), req.body);

  if (exhibition) {
    res.json(exhibition);
  } else {
    res.status(404).json({ error: 'Exhibition not found' });
  }
});

app.delete('/api/exhibitions/:id', authenticateToken, async (req: Request, res: Response) => {
  const deleted = await exhibitionsRepo.remove(String(req.params.id));

  if (deleted) {
    res.json({ message: 'Exhibition deleted successfully' });
  } else {
    res.status(404).json({ error: 'Exhibition not found' });
  }
});

// ==================== ARTISTS API ====================

app.get('/api/artists', async (_req: Request, res: Response) => {
  const artists = await artistsRepo.getAll();
  res.json(artists);
});

app.get('/api/artists/:id', async (req: Request, res: Response) => {
  const artist = await artistsRepo.getById(String(req.params.id));

  if (artist) {
    res.json(artist);
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

app.post('/api/artists', authenticateToken, async (req: Request, res: Response) => {
  try {
    const artist = await artistsRepo.create(req.body);
    res.status(201).json(artist);
  } catch (error) {
    console.error('Create artist error:', error);
    res.status(500).json({ error: 'Failed to create artist' });
  }
});

app.put('/api/artists/:id', authenticateToken, async (req: Request, res: Response) => {
  const artist = await artistsRepo.update(String(req.params.id), req.body);

  if (artist) {
    res.json(artist);
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

app.delete('/api/artists/:id', authenticateToken, async (req: Request, res: Response) => {
  const deleted = await artistsRepo.remove(String(req.params.id));

  if (deleted) {
    res.json({ message: 'Artist deleted successfully' });
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

// ==================== NEWS API ====================

app.get('/api/news', async (_req: Request, res: Response) => {
  const news = await newsRepo.getAll();
  res.json(news);
});

app.get('/api/news/:id', async (req: Request, res: Response) => {
  const article = await newsRepo.getById(String(req.params.id));

  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: 'News article not found' });
  }
});

app.post('/api/news', authenticateToken, async (req: Request, res: Response) => {
  try {
    const article = await newsRepo.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Failed to create news article' });
  }
});

app.put('/api/news/:id', authenticateToken, async (req: Request, res: Response) => {
  const article = await newsRepo.update(String(req.params.id), req.body);

  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: 'News article not found' });
  }
});

app.delete('/api/news/:id', authenticateToken, async (req: Request, res: Response) => {
  const deleted = await newsRepo.remove(String(req.params.id));

  if (deleted) {
    res.json({ message: 'News article deleted successfully' });
  } else {
    res.status(404).json({ error: 'News article not found' });
  }
});

// ==================== SHOP API ====================

app.get('/api/shop', async (_req: Request, res: Response) => {
  const items = await shopRepo.getAll();
  res.json(items);
});

app.get('/api/shop/:id', async (req: Request, res: Response) => {
  const item = await shopRepo.getById(String(req.params.id));

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Shop item not found' });
  }
});

app.post('/api/shop', authenticateToken, async (req: Request, res: Response) => {
  try {
    const item = await shopRepo.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('Create shop item error:', error);
    res.status(500).json({ error: 'Failed to create shop item' });
  }
});

app.put('/api/shop/:id', authenticateToken, async (req: Request, res: Response) => {
  const item = await shopRepo.update(String(req.params.id), req.body);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Shop item not found' });
  }
});

app.delete('/api/shop/:id', authenticateToken, async (req: Request, res: Response) => {
  const deleted = await shopRepo.remove(String(req.params.id));

  if (deleted) {
    res.json({ message: 'Shop item deleted successfully' });
  } else {
    res.status(404).json({ error: 'Shop item not found' });
  }
});

// ==================== ORDERS API ====================

app.get('/api/orders', authenticateToken, async (_req: Request, res: Response) => {
  const orders = await ordersRepo.getAll();
  res.json(orders);
});

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  const order = await ordersRepo.getById(String(req.params.id));

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const order = await ordersRepo.create(req.body);

    // Send email asynchronously (fire-and-forget)
    // Wrapped in setTimeout to ensure it doesn't block response
    setImmediate(() => {
      sendOrderConfirmationEmail(order).catch((error) => {
        console.error('Failed to send order confirmation email:', error);
      });
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', authenticateToken, async (req: Request, res: Response) => {
  const order = await ordersRepo.update(String(req.params.id), req.body);

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.delete('/api/orders/:id', authenticateToken, async (req: Request, res: Response) => {
  const deleted = await ordersRepo.remove(String(req.params.id));

  if (deleted) {
    res.json({ message: 'Order deleted successfully' });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// ==================== PICKUP POINTS API ====================

app.get('/api/pickup-points', async (_req: Request, res: Response) => {
  const pickupPoints = await pickupPointsRepo.getAll();
  res.json(pickupPoints);
});

app.post('/api/pickup-points', authenticateToken, async (req: Request, res: Response) => {
  try {
    const pickupPoint = await pickupPointsRepo.create(req.body);
    res.status(201).json(pickupPoint);
  } catch (error) {
    console.error('Create pickup point error:', error);
    res.status(500).json({ error: 'Failed to create pickup point' });
  }
});

app.put('/api/pickup-points/:id', authenticateToken, async (req: Request, res: Response) => {
  const pickupPoint = await pickupPointsRepo.update(String(req.params.id), req.body);

  if (pickupPoint) {
    res.json(pickupPoint);
  } else {
    res.status(404).json({ error: 'Pickup point not found' });
  }
});

app.delete('/api/pickup-points/:id', authenticateToken, async (req: Request, res: Response) => {
  const deleted = await pickupPointsRepo.remove(String(req.params.id));

  if (deleted) {
    res.json({ message: 'Pickup point deleted successfully' });
  } else {
    res.status(404).json({ error: 'Pickup point not found' });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Begilda Gallery API is running' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
function startServer(): void {
  app.listen(PORT, () => {
    console.log(`🎨 Begilda Gallery API server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`💾 Using Prisma with SQLite database`);
  });
}

startServer();
