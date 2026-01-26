# Improvements Roadmap

High-level roadmap for Begilda Gallery platform improvements.

## Priority 1: Security & Infrastructure

### Authentication System
Implement JWT-based authentication for the admin panel.
+ Login/logout functionality
+ Token generation and validation
+ Protected API routes
- Session management

### Database Migration ✅ (Completed: January 2026)
Move from JSON files to a proper database.
+ ✅ **Phase 1**: Migrated to SQLite with Prisma ORM
+ ✅ Schema design for all entities (10 models in prisma/schema.prisma)
+ ✅ Data migration script (npm run db:migrate)
+ ✅ Repository pattern with async/await
+ ✅ **Phase 2**: PostgreSQL support via DATABASE_URL switching
+ ✅ All 7 repositories refactored to use Prisma
+ ✅ Server routes updated to async handlers

**Details:**
- Using Prisma 5.22.0 with SQLite (dev) and PostgreSQL (production) support
- 10 models: Artist, Painting, Exhibition, ExhibitionPainting, News, ShopItem, PickupPoint, Order, OrderItem
- Seamless database switching via DATABASE_URL environment variable
- Automatic JSON-to-database migration with ID conversion and relation handling
- Database backups on migration runs

### Input Validation
Add validation on both frontend and backend.
- Request payload validation (consider Zod)
- Sanitization to prevent XSS
- Type-safe API contracts

---

## Priority 2: Order Management

### Admin Order Processing
Enhance order management capabilities in admin panel.
- Order status updates (pending → confirmed → shipped → delivered)
- Order filtering and search
- Bulk actions

### Email Notifications
Notify customers about order status changes.
- Order confirmation emails
- Status update notifications
- Integration with email service (consider Resend, SendGrid)

### Order Tracking
Allow customers to track their orders.
- Generate unique reference numbers
- Public order tracking page (by reference ID or email link)
- Real-time status display

---

## Priority 3: Internationalization

### Multi-Language Support (i18n)
Support for Russian, Kazakh, and English.
- Translation infrastructure (consider react-i18next)
- Language switcher in header
- Translated content for all UI text
- Consider right-to-left support for future languages

### Currency Improvements
Enhance multi-currency handling.
- Persist user currency preference
- Display prices in selected currency throughout
- Improve exchange rate caching

---

## Priority 4: Code Quality

### TypeScript Strictness ✅ (Completed: January 2026)
Eliminate `any` types throughout codebase.
+ ✅ Enable strict mode in tsconfig
+ ✅ Define proper interfaces for all data structures
+ ✅ Type API responses and requests
+ ✅ Create discriminated union for CartItem (PaintingCartItem | ShopCartItem)
+ ✅ Add API type definitions (CreateXRequest, UpdateXRequest for all resources)
+ ✅ Add form data types for all admin managers
+ ✅ Update all models with missing properties (imageUrl, optional fields)
+ ✅ Fix all admin components to use typed interfaces
+ ✅ Remove all local interface definitions in favor of centralized types
+ ✅ Zero TypeScript errors in admin panel and new code (App.tsx legacy code excluded)

**Details:**
- Created `src/types/api/index.ts` with typed request/response interfaces
- Created `src/types/forms/index.ts` with form data types for admin panels
- Updated models: Painting, Exhibition, ShopItem, Order, PickupPoint, Cart
- Fixed CartItem discriminated union pattern in PublicLayout
- All admin managers now use centralized type definitions
- Proper type guards and type assertions where necessary
- Build succeeds with zero errors

### API Client Refactoring
Split monolithic client into domain-specific modules.
- Separate clients per resource (paintings, orders, etc.)
- Shared HTTP utilities module
- Better error handling patterns

### State Management
Improve frontend state handling.
- Consider React Context for global state
- Reduce prop drilling
- Centralize cart and user preferences

### Cleanup
Remove legacy code and unused dependencies.
+ ✅ Remove unused interface definitions (ExchangeRate in currency.ts)
+ ✅ Remove unused imports (useEffect from AdminApp.tsx, AdminLayout.tsx)
+ ✅ Install missing type definitions (@types/react-dom)
- Delete `_old` files in admin pages
- Remove unused `apps/` and `packages/` directories
- Audit and remove unused npm packages

---

## Priority 5: Performance & UX

### Pagination
Add pagination for large lists.
- Paintings catalog
- Admin data tables
- API support for paginated queries

### Image Optimization
Improve image handling.
- Generate thumbnails on upload
- Lazy loading for gallery images
- Consider CDN or cloud storage (S3, Cloudinary)

### Loading States
Improve perceived performance.
- Skeleton loaders for content
- Optimistic updates where appropriate
- Better error states and retry options

---

## Future Considerations

These items are not immediate priorities but worth considering:

- **User Accounts**: Customer registration, order history, wishlists
- **Online Payments**: Kaspi Pay, card payments integration
- **Search**: Full-text search across paintings, artists, exhibitions
- **Analytics**: Dashboard with sales and visitor statistics
- **Testing**: Unit tests, integration tests, E2E tests
- **CI/CD**: Automated testing and deployment pipeline

---

## Related Documentation

- [LLM Context](./.llm-context.md) - Architecture, patterns, and coding standards for developers
- [README](../README.md) - Platform description, setup instructions, and overview
