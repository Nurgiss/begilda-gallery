# Begilda Gallery - Improvements & Roadmap

## Completed Features

### ✅ Email Notifications (Order Confirmations)
- **Status**: Implemented and tested
- **Features**:
  - Automatic order confirmation email sent to customer after successful order placement
  - HTML template with Begilda Gallery branding (dark/gold color scheme)
  - Plain text fallback for compatibility
  - Fire-and-forget pattern (doesn't block order creation)
  - Includes: Order ID, customer info, delivery details, items table, total amount
  - Error handling with detailed logging
- **Implementation**:
  - [backend/src/services/email.ts](./backend/src/services/email.ts) — Email service
  - [backend/src/templates/orderConfirmation.ts](./backend/src/templates/orderConfirmation.ts) — Email templates
  - Integrated in [backend/src/server.ts](./backend/src/server.ts) (POST /api/orders endpoint)
- **Configuration**: Google Workspace Gmail SMTP (port 587 with STARTTLS)
- **Testing**: Local Gmail support, configured for production deployment
- **Date Completed**: January 2026

---

## High Priority (Next Sprint)

### Order Status Emails
- Send email when order status changes: pending → processing → completed
- Email template variations for each status
- Include new payment details when status changes to processing
- Track email send history in database

### Admin Authentication & Authorization
- Implement JWT token-based authentication on admin endpoints
- Secure sensitive endpoints: /api/exhibitions, /api/paintings, /api/shop (POST/PUT/DELETE)
- Add role-based access control (admin-only views in frontend)
- Audit log for admin actions (create, update, delete operations)

### Backend Refactoring
- Split monolithic [backend/src/server.ts](./backend/src/server.ts) into modular route handlers
- Create route files: paintings.ts, exhibitions.ts, artists.ts, news.ts, shop.ts, orders.ts, pickupPoints.ts
- Move business logic to service layer (e.g., `services/orderService.ts`)
- Improve type safety across all endpoints

---

## Medium Priority (Later Sprint)

### Frontend API Client Refactoring
- Split monolithic [src/api/client.ts](./src/api/client.ts) into domain-specific files:
  - `api/paintings.ts`, `api/exhibitions.ts`, `api/artists.ts`, `api/news.ts`
  - `api/shop.ts`, `api/orders.ts`, `api/pickupPoints.ts`
- Add comprehensive error handling with typed responses
- Add request timeout and retry logic
- Document API types alongside client functions

### Admin App Routing Migration
- Migrate admin app from old custom routing to React Router v7
- Match public app architecture for consistency
- Create admin route definitions in separate file
- Improve code organization and maintainability

### Internationalization (i18n)
- Set up i18n framework (React i18next or similar)
- Translate all static text to Russian and Kazakh
- Handle number/currency formatting per locale
- Add language switcher in header

---

## Low Priority (Backlog)

### Performance & SEO
- Add metadata (title, description) to each page route
- Implement Open Graph tags for sharing
- Optimize image loading with lazy loading and srcset
- Add breadcrumb navigation for SEO
- Compress and serve optimized image formats (WebP)

### Data Migration
- Complete migration from JSON files to PostgreSQL (currently SQLite for dev)
- Create database backup strategy
- Implement data validation layer for imports

### Enhanced Gallery Features
- Virtual gallery tour / 360° painting views
- Artist portfolio pages with bio and archive
- Exhibition timeline view
- Wishlist/favorites functionality for paintings

### Payment Integration
- Integrate Stripe or local payment provider
- Add payment status tracking in order management
- Send payment receipts to customers
- Implement subscription/recurring purchases for shop items

### Analytics & Monitoring
- Track user behavior (page views, search queries, cart abandonment)
- Monitor email delivery rates and bounces
- Set up error tracking (Sentry or similar)
- Create admin dashboard for sales analytics

### Infrastructure
- Move uploads to cloud storage (S3 or Cloudinary)
- Set up CI/CD pipeline (GitHub Actions)
- Add automated testing (Jest, React Testing Library)
- Deploy to production environment (Vercel/Netlify for frontend, Railway/Render for backend)
- Set up environment-specific configurations

---

## Known Issues & Technical Debt

### Security
- [ ] Admin endpoints lack JWT authentication (CRITICAL)
- [ ] No input validation on order checkout form (should validate email, phone format)
- [ ] Password hashing: verify bcrypt configuration is production-ready
- [ ] HTTPS not enforced in production setup

### Code Quality
- [ ] [src/api/client.ts](./src/api/client.ts) uses `any` types (needs strict typing)
- [ ] Error messages could expose sensitive information (e.g., SMTP credentials in logs)
- [ ] No request rate limiting on public endpoints
- [ ] Missing type definitions for some API responses

### Testing
- [ ] No automated tests implemented
- [ ] Email service tested manually (consider adding integration tests)
- [ ] No e2e tests for checkout flow

### Documentation
- [ ] API endpoint documentation missing (consider OpenAPI/Swagger)
- [ ] Database schema documentation needed
- [ ] Deployment guide incomplete

---

## Dependencies & Tech Stack Notes

### Backend Stack
- **Express.js**: v4.x (HTTP server)
- **Prisma**: v7 (ORM, SQLite dev + PostgreSQL production)
- **TypeScript**: v5.x (type safety)
- **Nodemailer**: v6.x (email service)
- **JWT**: jsonwebtoken (authentication)
- **Bcrypt**: bcryptjs (password hashing)
- **Multer**: File upload middleware

### Frontend Stack
- **React**: 18.x (UI framework)
- **TypeScript**: 5.x (type safety)
- **Tailwind CSS**: v4 with @tailwindcss/vite plugin
- **Radix UI**: Component library (48+ pre-built components)
- **React Router**: v7 (routing, public app)
- **Vite**: Build tool with dual entry points

### Email Configuration
- **Service**: Gmail SMTP (Google Workspace)
- **Port**: 587 (STARTTLS)
- **Authentication**: Google App Passwords (16-character key)
- **Template Format**: HTML (table-based) + plain text fallback
- **Rate Limits**: 2,000 emails/day (Google Workspace limit)

---

## Deployment Checklist

Before moving to production:

- [ ] Add admin authentication (JWT tokens)
- [ ] Migrate database to PostgreSQL
- [ ] Set strong JWT_SECRET (`openssl rand -hex 32`)
- [ ] Configure production Gmail/email credentials
- [ ] Enable HTTPS for all endpoints
- [ ] Set up error monitoring (Sentry)
- [ ] Add automated backups for database
- [ ] Test email delivery with real addresses
- [ ] Verify file upload security (virus scanning)
- [ ] Load test order creation endpoint
- [ ] Set up CI/CD pipeline
- [ ] Document deployment procedure
- [ ] Configure CDN for static assets
- [ ] Set up monitoring/uptime alerts

---

## Contact & Support
For questions about this roadmap or to request features, contact the development team.
Last updated: January 2026
