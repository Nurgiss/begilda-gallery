# LLM Context - Begilda Gallery

## LLM Behavior
- Be direct and challenging — point out issues, don't sugarcoat
- When uncertain (< 98% sure), ask for clarification before proceeding
- Prioritize: security > type safety > maintainability > UX
- Explain architectural decisions and ask for permission on significant changes
- Use Context7 MCP for up-to-date documentation when available

---

## Quick Facts
- **Project**: Hybrid art gallery (physical in Kazakhstan + online platform)
- **Build**: Dual-entry Vite (public + admin apps)
- **Frontend**: React 18 + TypeScript + Tailwind v4 + Radix UI
- **Backend**: Node.js + Express.js (single file: backend/server.js)
- **Data**: JSON files (migrating to SQLite)
- **Languages**: Russian, Kazakh, English (i18n planned, not implemented)
- **Currencies**: KZT (base), USD, EUR (frontend conversion)

---

## Critical Paths
| Purpose | Path |
|---------|------|
| **Public routing** | [src/routes.tsx](../src/routes.tsx) (React Router v7, NEW) |
| **Public entry** | [src/main.tsx](../src/main.tsx) |
| **Public HTML** | [index.html](../index.html) |
| **Admin entry** | [src/admin-main.tsx](../src/admin-main.tsx) |
| **Admin HTML** | [admin.html](../admin.html) |
| **Admin app** | [src/app/AdminApp.tsx](../src/app/AdminApp.tsx) |
| **API client** | [src/api/client.ts](../src/api/client.ts) (monolithic, 246 lines) |
| **Backend (main)** | [backend/src/server.ts](../backend/src/server.ts) (Express routes with Prisma ORM) |
| **Backend (repos)** | [backend/src/repositories/](../backend/src/repositories/) (data access layer) |
| **Email service** | [backend/src/services/email.ts](../backend/src/services/email.ts) (Nodemailer integration) |
| **Type models** | [src/types/models/](../src/types/models/) (9 files) + [backend/src/types/](../backend/src/types/) |
| **Data storage** | [backend/data/](../backend/data/) (paintings.json, exhibitions.json, etc.) |
| **Build config** | [vite.config.ts](../vite.config.ts) (@tailwindcss/vite plugin) |

---

## Architecture Patterns

### Routing (Public App)
- **CURRENT**: React Router v7 with [routes.tsx](../src/routes.tsx) + [PublicLayout](../src/app/layouts/PublicLayout.tsx)
- **LEGACY**: [src/app/App.tsx](../src/app/App.tsx) (348 lines, old custom routing — ignore for new work)
- **Migration Status**: Public app migrated (commit b790ef4), admin still uses old pattern
- **Add New Page**: Define route in routes.tsx, create component in src/app/pages/, wrap in PublicLayout

### API Layer
- **RULE**: Never fetch() directly in components — always use [src/api/client.ts](../src/api/client.ts)
- **CURRENT**: Monolithic (all resources in one file)
- **FUTURE**: Split into domain clients (paintings.ts, orders.ts, exhibitions.ts, etc.)
- **Pattern**: Helper functions (getHeaders, getJSON, postJSON, putJSON, deleteJSON) + resource functions
- **Example**: `import { getPaintings } from '@/api/client'; const paintings = await getPaintings();`

### State Management
- **App-level**: Context/props via [src/app/context/AppContext.tsx](../src/app/context/AppContext.tsx)
- **Persistence**: localStorage for cart, currency preference
- **No global library**: No Redux, Zustand, or Context API wrapper (use props or localStorage)
- **Pattern**: `const [data, setData] = useState<T[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);`

### Build System
- **Vite config**: [vite.config.ts](../vite.config.ts) with dual entry points (rollupOptions.input)
- **Tailwind v4**: Uses `@tailwindcss/vite` plugin (NO tailwind.config.js needed)
- **Output**: dist/ with separate public and admin builds

### File Upload
- **Backend**: Multer middleware, stores in [backend/uploads/](../backend/uploads/)
- **Limits**: 10MB max, JPEG/PNG/GIF/WebP only
- **Future**: Consider S3/Cloudinary for scalability

### Email Notifications
- **Status**: IMPLEMENTED ✅
- **Service**: Nodemailer with Gmail SMTP (Google Workspace)
- **Trigger**: Automatically sends order confirmation email after successful order creation
- **Components**:
  - [backend/src/services/email.ts](../backend/src/services/email.ts) — Email service with nodemailer integration
  - [backend/src/templates/orderConfirmation.ts](../backend/src/templates/orderConfirmation.ts) — HTML and plain text templates
  - Integration in [backend/src/server.ts](../backend/src/server.ts) (POST /api/orders, lines ~422-426)
- **Pattern**: Fire-and-forget async (uses `setImmediate` to prevent blocking order response)
- **Configuration**: SMTP credentials in `.env` (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, etc.)
- **Error Handling**: Emails fail gracefully without blocking order creation; errors logged for monitoring

### Authentication (NOT IMPLEMENTED — SECURITY GAP)
- **Status**: PLANNED but not built (admin endpoints unprotected)
- **Strategy**: JWT-based tokens
- **When Added**: Store in localStorage, send as Authorization header in all requests

---

## TypeScript Standards
- **Strict mode**: No `any` types — define interfaces for everything
- **Interfaces**: Always for API payloads, component props, state objects
- **Use existing types**: See [src/types/models/](../src/types/models/) for 9 core models:
  - Painting, Exhibition, Artist, News, ShopItem, Order, PickupPoint, Cart, Artwork
- **File naming**:
  - Components: PascalCase.tsx (e.g., PaintingCard.tsx)
  - Utilities: camelCase.ts (e.g., formatCurrency.ts)
  - Types: PascalCase.ts in src/types/
  - Pages: PascalCase.tsx in src/app/pages/

### Code Style
- Use functional components + hooks
- Prefer `const` over `let`, never use `var`
- Early returns to avoid nesting (not ternaries or deep if-else)
- Keep components < 200 lines
- Extract reusable logic into custom hooks

---

## Known Issues & Gotchas

### Tailwind Configuration
- ❌ `tailwind.config.js` DOES NOT EXIST (referenced in old docs but removed)
- ✅ Project uses `@tailwindcss/vite` plugin in [vite.config.ts](../vite.config.ts)
- PostCSS config is empty (Tailwind v4 doesn't need it)

### Legacy Code to Ignore
- [src/app/App.tsx](../src/app/App.tsx) — Old router, ignore for new pages
- **_old files in admin**: ExhibitionsManager_old.tsx, NewsManager_old.tsx, ShopManager_old.tsx (safe to delete)
- [apps/](../apps/) and [packages/](../packages/) directories (unused monorepo structure, ignore)

### Code Quality Issues (Planned Improvements)
- [src/api/client.ts](../src/api/client.ts) uses `any` types (needs strict typing)
- [backend/src/server.ts](../backend/src/server.ts) is monolithic (should split into route handlers)
- Admin app still uses old routing pattern (needs React Router v7 migration)
- No authentication on admin endpoints (security risk)
- Email notifications for order status changes (currently only sends on creation)

---

## Security Checklist

Before committing code:
- [ ] Input validation on both frontend and backend
- [ ] XSS sanitization before rendering user data
- [ ] File upload validation (type, size, virus scan if possible)
- [ ] Use parameterized queries when SQLite migration is done
- [ ] JWT validation on all admin endpoints (when auth is added)
- [ ] Never commit secrets to .env files
- [ ] Use HTTPS in production

---

## Component Inventory
- **Radix UI**: 48 pre-built components in [src/app/components/ui/](../src/app/components/ui/)
- **Custom**: ~16 components in [src/app/components/](../src/app/components/)
- **Pages**: 8 public (home, catalog, exhibitions, artists, shop, cart, checkout, news) + 4+ admin

---

## Environment Variables

**Development (.env - Frontend):**
```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ADMIN_PATH_PREFIX=<your-secret-admin-prefix>
```

**Development (.env - Backend):**
```bash
DATABASE_URL="file:./data/gallery.db"
PORT=3001
JWT_SECRET=begilda-gallery-local-dev-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt-hash>

# Email (Gmail SMTP with Google Workspace)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=<google-app-password-16-chars>
SMTP_FROM_NAME=Begilda Gallery
SMTP_FROM_EMAIL=your-gmail@gmail.com

# Gallery contact info (for email footer)
GALLERY_NAME=Begilda Gallery
GALLERY_PHONE=+7 (XXX) XXX-XX-XX
GALLERY_EMAIL=info@begilda.gallery
GALLERY_ADDRESS=Gallery Address, City, Kazakhstan
GALLERY_WEBSITE=https://begilda.gallery
```

**Production (.env.production - Frontend):**
```bash
VITE_API_BASE_URL=/api
VITE_ADMIN_PATH_PREFIX=<your-secret-admin-prefix>
```

**Production (.env - Backend):**
- Use PostgreSQL for DATABASE_URL (migrated from SQLite)
- Use strong JWT_SECRET (generate: `openssl rand -hex 32`)
- Use production Gmail/email credentials with App Passwords
- Never commit .env to git

---

## Git Conventions
Simple, descriptive commit messages:
```
Add painting detail page
Fix cart total calculation for multi-currency
Update exhibition filter to include past events
Remove unused admin components
```

- Start with a verb (Add, Fix, Update, Remove, Refactor)
- Keep first line < 72 characters
- Reference issue numbers when applicable: `Fix cart bug (#123)`

---

## Related Documentation
- [Roadmap](./improvements.md) — Feature priorities and planned improvements
- README.md — Setup instructions and overview

---

## Quick Start for New Contributors
1. Read this file (you're here)
2. Check [src/types/models/](../src/types/models/) for data structures
3. Look at [src/routes.tsx](../src/routes.tsx) for routing patterns
4. Reference [src/api/client.ts](../src/api/client.ts) for API usage
5. Read [backend/server.js](../backend/server.js) to understand endpoints
