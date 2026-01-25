# Begilda Gallery - Project Overview

## About the Gallery

Begilda Gallery is a **hybrid art gallery** combining a physical exhibition space with a full-featured online platform. Located in Kazakhstan, the gallery bridges local artistic talent with a global audience.

## Target Audience

- **General Public** — Casual visitors exploring art for cultural enrichment or occasional purchases. Need an accessible, easy-to-navigate experience.

- **Art Enthusiasts** — Regular visitors who follow artists and exhibitions closely. Value detailed artwork information and gallery news.

- **Collectors** — Serious buyers seeking original artwork. Expect professional service, documentation, and reliable transactions.

- **International Tourists** — Visitors to Kazakhstan looking for local art. Require multi-language support and clear currency/shipping information.

The platform supports three languages: **Russian**, **Kazakh**, and **English** (i18n implementation in progress).

## Platform Structure

The platform consists of two main applications:

### Public Website
The customer-facing application where visitors can:
- Browse the painting catalog with filtering options
- View current, upcoming, and past exhibitions
- Explore artist profiles and their works
- Shop for merchandise
- Place orders with multi-currency support (KZT, USD, EUR)
- Track orders via reference number

### Admin Panel
A management interface for gallery staff to:
- Manage paintings, exhibitions, artists, and news
- Handle shop inventory
- Process and track orders
- Configure pickup points
- Upload and manage images

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Radix UI | Accessible component primitives |
| Material-UI | Additional UI components |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| Multer | File upload handling |

### Data Storage
| Current | Planned |
|---------|---------|
| JSON files | SQLite → PostgreSQL |

### Deployment
- **Hosting**: VPS on ps.kz
- **Frontend**: Static files served via Vite build
- **Backend**: Node.js Express server

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────────┐          ┌─────────────────┐          │
│  │  Public Site    │          │  Admin Panel    │          │
│  │  (index.html)   │          │  (admin.html)   │          │
│  └────────┬────────┘          └────────┬────────┘          │
│           │                            │                    │
│           └──────────┬─────────────────┘                    │
│                      │                                      │
│              ┌───────▼───────┐                              │
│              │  API Client   │                              │
│              │ (src/api/)    │                              │
│              └───────┬───────┘                              │
└──────────────────────┼──────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────┼──────────────────────────────────────┐
│                      │        Backend                        │
│              ┌───────▼───────┐                              │
│              │ Express.js    │                              │
│              │ (server.js)   │                              │
│              └───────┬───────┘                              │
│                      │                                      │
│         ┌────────────┼────────────┐                         │
│         │            │            │                         │
│  ┌──────▼──────┐ ┌───▼───┐ ┌─────▼─────┐                   │
│  │ JSON Data   │ │Uploads│ │ (Future)  │                   │
│  │ /data/*.json│ │/uploads│ │ SQLite DB │                   │
│  └─────────────┘ └───────┘ └───────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Core Data Models

### Painting
Artwork available for viewing and purchase.
- Title, artist, year, dimensions, medium
- Price (KZT base, with USD/EUR conversion)
- Category, availability, featured status
- High-resolution image

### Exhibition
Gallery events showcasing artwork.
- Title, location, dates
- Status: current, upcoming, or past
- Associated paintings
- Featured image

### Artist
Creators whose work is displayed.
- Name, biography
- Profile image
- Associated paintings

### Order
Customer purchases.
- Items (paintings or shop merchandise)
- Customer information
- Status tracking (pending → confirmed → shipped → delivered)
- Reference number for tracking

### Shop Item
Merchandise available for purchase.
- Name, description, price
- Stock quantity
- Product images

## Key Features

### Multi-Currency Support
- Base currency: KZT (Kazakhstani Tenge)
- Supported currencies: USD, EUR
- Live exchange rates via Open Exchange Rates API
- Fallback rates for offline operation

### Order Management
- Order placement with customer details
- Status tracking through lifecycle
- Reference number generation
- Email notifications (planned)

### Image Management
- Upload support for JPEG, PNG, GIF, WebP
- 10MB file size limit
- Stored in `/backend/uploads/`

## Project Status

**Current Phase**: MVP / Active Development

| Feature | Status |
|---------|--------|
| Public catalog | Complete |
| Exhibitions | Complete |
| Artists | Complete |
| Shop | Complete |
| Cart & Checkout | Complete |
| Admin CRUD | Complete |
| Authentication | Planned |
| Database migration | Planned |
| i18n (ru/kz/en) | Planned |
| Order tracking | Planned |
| Email notifications | Planned |

## Directory Structure

```
begilda-gallery/
├── backend/
│   ├── server.js          # Express server & all routes
│   ├── data/              # JSON data files
│   │   ├── paintings.json
│   │   ├── exhibitions.json
│   │   ├── artists.json
│   │   ├── news.json
│   │   ├── shop.json
│   │   ├── orders.json
│   │   └── pickupPoints.json
│   ├── uploads/           # Uploaded images
│   └── package.json
├── src/
│   ├── api/               # API client layer
│   ├── app/
│   │   ├── components/    # Reusable components
│   │   └── pages/         # Page components
│   │       └── admin/     # Admin panel pages
│   ├── types/
│   │   ├── models/        # Data model interfaces
│   │   └── common/        # Shared types
│   └── styles/            # CSS files
├── docs/                  # Documentation
├── public/                # Static assets
├── index.html             # Public app entry
├── admin.html             # Admin app entry
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd begilda-gallery

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Start development servers
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend && npm start
```

### Environment Configuration

Create `.env` in the project root:
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ADMIN_PATH_PREFIX=<your-admin-prefix>
```

### Production Build

```bash
npm run build
```

Output is generated in the `dist/` directory.

## Related Documentation

- [LLM Coding Guide](./llm-guide.md) - Instructions for AI assistants
- [Improvements Roadmap](./improvements.md) - Planned enhancements
