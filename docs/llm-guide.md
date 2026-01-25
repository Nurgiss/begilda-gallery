# LLM Coding Assistant Guide

This document provides instructions for AI coding assistants (Claude, GPT, etc.) working on the Begilda Gallery codebase.

## LLM Behavior Guidelines

When working on this project, AI assistants should:

**Be Direct and Challenging**
- Provide straightforward feedback without excessive hedging
- Challenge questionable design decisions or patterns
- Point out potential issues even if not explicitly asked
- Don't sugarcoat problems - be honest about code quality and technical debt

**Push Modern Best Practices**
- Advocate for current industry standards and patterns
- Suggest improvements when you see outdated approaches
- Recommend better alternatives even for working code
- Stay up to date with React, TypeScript, and Node.js ecosystems

**Ask Questions When Uncertain**
- If you're not 98% sure about something, ask for clarification
- Don't assume requirements - verify with the user
- Question ambiguous specifications before implementing
- Clarify business logic that could be interpreted multiple ways

**Prioritize Quality**
- Security over convenience
- Type safety over quick fixes
- Maintainability over clever solutions
- User experience over developer convenience

**Communicate Changes Clearly**
- Before making changes, provide a short but detailed description of what you're about to do
- Ask for permission before implementing significant changes
- Explain the "why" behind architectural decisions
- When creating multiple files, outline the structure first and get approval

**Use Context7 MCP for Documentation**
- Recommend installing [Context7 MCP](https://github.com/upstash/context7) if not already available
- Use Context7 to fetch up-to-date documentation for project dependencies (React, Tailwind, Radix UI, Express, etc.)
- This ensures recommendations are based on current API documentation rather than potentially outdated training data
- Especially useful when working with frequently updated libraries or when unsure about current best practices

---

## Project Overview

Begilda Gallery is a hybrid art gallery platform (physical gallery + online presence) based in Kazakhstan. The platform serves art enthusiasts and collectors, with a focus on local visitors and international tourists.

**Key URLs:**
- Public site: `index.html` entry point
- Admin panel: `admin.html` entry point (protected path prefix in env)

## Project Structure

```
begilda-gallery/
├── backend/                 # Node.js Express API
│   ├── server.js           # Main server file (all routes)
│   ├── data/               # JSON data storage (migrating to SQLite)
│   └── uploads/            # User-uploaded images
├── src/                    # React frontend (TypeScript)
│   ├── api/               # API client layer
│   │   ├── client.ts      # Centralized HTTP calls
│   │   └── currency.ts    # Currency conversion
│   ├── app/
│   │   ├── components/    # Reusable UI components
│   │   └── pages/         # Page components
│   │       └── admin/     # Admin panel pages
│   ├── types/             # TypeScript interfaces
│   │   ├── models/        # Data models
│   │   └── common/        # Shared types
│   └── styles/            # CSS files
├── docs/                  # Documentation
├── dist/                  # Production build output
└── vite.config.ts         # Vite configuration
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI, Material-UI |
| Backend | Node.js, Express.js |
| Database | JSON files (migrating to SQLite → PostgreSQL) |
| Auth | JWT (planned) |

## Code Conventions

### TypeScript Standards

**Enforce strict TypeScript. Avoid `any` type.**

```typescript
// BAD - avoid any
const handleClick = (item: any) => { ... }

// GOOD - use proper interfaces
interface CartItem {
  id: string;
  type: 'painting' | 'shop';
  quantity: number;
  price: number;
}
const handleClick = (item: CartItem) => { ... }
```

**Always define interfaces for:**
- API request/response payloads
- Component props
- State objects
- Function parameters

**Use existing types from `src/types/models/`:**
- `Painting`, `Exhibition`, `Artist`, `News`, `ShopItem`, `Order`, `PickupPoint`

### Security Guidelines

1. **Input Validation**: Always validate user input on both frontend and backend
2. **Sanitization**: Sanitize data before rendering (prevent XSS)
3. **SQL Injection**: Use parameterized queries when database is implemented
4. **File Uploads**: Validate file types and sizes
5. **Authentication**: All admin endpoints must require JWT validation
6. **Environment Variables**: Never commit secrets, use `.env` files

### Code Style

- Use functional components with hooks
- Prefer `const` over `let`, never use `var`
- Use descriptive variable names
- Keep components focused and small (< 200 lines ideally)
- Extract reusable logic into custom hooks
- Use early returns to reduce nesting

```typescript
// GOOD - early return
const getPrice = (item: Painting | null): number => {
  if (!item) return 0;
  if (!item.availability) return 0;
  return item.price;
};

// BAD - deep nesting
const getPrice = (item: Painting | null): number => {
  if (item) {
    if (item.availability) {
      return item.price;
    }
  }
  return 0;
};
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `PaintingCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatCurrency.ts`)
- Types: `PascalCase.ts` in `types/` directory
- Pages: `PascalCase.tsx` in `pages/` directory

### API Client Architecture

All API calls should go through dedicated client modules in `src/api/`.

**Current State:**
- `src/api/client.ts` - Centralized HTTP calls for all resources
- `src/api/currency.ts` - Currency conversion service

**Future Direction:**
The API layer should be split into domain-specific clients for better organization and maintainability:

```
src/api/
├── index.ts           # Re-exports all clients
├── http.ts            # Base HTTP utilities (headers, error handling)
├── paintings.ts       # Paintings CRUD operations
├── exhibitions.ts     # Exhibitions CRUD operations
├── artists.ts         # Artists CRUD operations
├── orders.ts          # Orders management
├── shop.ts            # Shop items CRUD
├── auth.ts            # Authentication (JWT)
└── currency.ts        # Currency conversion
```

**Guidelines:**
- Never make direct `fetch` calls from components
- Each domain client should handle its own types and error cases
- Shared HTTP logic (auth headers, base URL, error handling) belongs in a base module
- Consider using a library like `axios` or `ky` for better request/response handling

```typescript
// GOOD - use dedicated API client
import { paintingsApi } from '../api/paintings';
const paintings = await paintingsApi.getAll();

// BAD - direct fetch in component
fetch('/api/paintings').then(...)
```

## Git Conventions

Use simple, descriptive commit messages:

```
Add painting detail page with zoom feature
Fix cart total calculation for multi-currency
Update exhibition filter to include past events
Remove unused admin components
```

**Guidelines:**
- Start with a verb (Add, Fix, Update, Remove, Refactor)
- Keep the first line under 72 characters
- Be specific about what changed
- Reference issue numbers when applicable: `Fix cart bug (#123)`

## Working on This Codebase

### Before Making Changes

1. Understand the existing patterns in the area you're modifying
2. Check `src/types/models/` for existing interfaces
3. Review related components to maintain consistency
4. Consider impact on both public site and admin panel

### When Adding Features

1. Start with TypeScript interfaces
2. Create/update API client functions in `src/api/`
3. Implement backend endpoint in `backend/server.js`
4. Build UI components
5. Add proper error handling
6. Test both success and error paths

### When Fixing Bugs

1. Understand the root cause before fixing
2. Consider if the bug exists elsewhere (similar patterns)
3. Ensure the fix doesn't break other functionality
4. Add type safety if the bug was caused by loose typing

### Common Patterns

**State Management:**
- App-level state lives in `App.tsx`
- Use props for component communication
- Use localStorage for persistence (cart, currency preference)

**API Calls:**
```typescript
// Pattern used throughout the codebase
const [data, setData] = useState<Painting[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await getPaintings();
      setData(result);
    } catch (err) {
      setError('Failed to load paintings');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

**Currency Handling:**
- Prices stored in KZT (base currency)
- Conversion done on frontend via `src/api/currency.ts`
- Display formatted prices using currency utilities

## Environment Variables

**Development (`.env`):**
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ADMIN_PATH_PREFIX=<admin-path-prefix>
```

**Production (`.env.production`):**
```
VITE_API_BASE_URL=/api
VITE_ADMIN_PATH_PREFIX=<admin-path-prefix>
```

## Running the Project

```bash
# Install dependencies
npm install
cd backend && npm install

# Start development
npm run dev          # Frontend (Vite)
cd backend && npm start  # Backend (Express)

# Build for production
npm run build
```

## Key Files Reference

| Purpose | File |
|---------|------|
| Main routing | `src/app/App.tsx` |
| API client | `src/api/client.ts` |
| Type definitions | `src/types/models/*.ts` |
| Backend routes | `backend/server.js` |
| Data storage | `backend/data/*.json` |
| Vite config | `vite.config.ts` |
| Tailwind config | `tailwind.config.js` |

## Notes

- The `apps/` and `packages/` directories are legacy/unused - ignore them
- Files ending in `_old` are deprecated and should be removed when refactoring
- Multi-language support (Russian, Kazakh, English) is planned but not yet implemented
- Database migration from JSON to SQLite is in progress
