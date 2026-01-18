# Begilda Gallery - Artist Portfolio Website

Полнофункциональный веб-сайт галереи с бэкендом на Node.js и фронтендом на React + TypeScript.

## 🚀 Быстрый старт

### Автоматический запуск (рекомендуется)

```bash
./start.sh
```

Этот скрипт автоматически запустит backend и frontend.

### Ручной запуск

**1. Запуск Backend API:**
```bash
cd backend
npm install  # только первый раз
npm start
```
Backend запустится на http://localhost:3001

**2. Запуск Frontend:**
```bash
npm install  # только первый раз  
npm run dev
```
Frontend запустится на http://localhost:5175

## 📁 Структура проекта

```
Artist Portfolio Website3/
├── backend/               # Node.js REST API
│   ├── server.js         # Express сервер
│   ├── data/             # JSON хранилище
│   │   ├── paintings.json
│   │   ├── exhibitions.json
│   │   ├── artists.json
│   │   ├── news.json
│   │   ├── shop.json
│   │   └── orders.json
│   └── package.json
│
├── src/                  # React Frontend
│   ├── api/
│   │   └── client.ts     # API клиент
│   ├── app/
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── pages/
│   └── styles/
│
├── .env                  # Настройки окружения
├── SETUP.md             # Подробная документация
└── start.sh             # Скрипт быстрого запуска
```

## 🛠 Технологии

**Frontend:**
- React 18 + TypeScript
- Vite
- Custom CSS

**Backend:**
- Node.js + Express
- JSON файловое хранилище
- REST API
- CORS enabled

## 📡 API Endpoints

Все эндпоинты доступны по адресу `http://localhost:3001/api`

### Картины (Paintings)
- `GET /paintings` - получить все картины
- `GET /paintings/:id` - получить картину
- `POST /paintings` - создать картину
- `PUT /paintings/:id` - обновить картину
- `DELETE /paintings/:id` - удалить картину

### Выставки (Exhibitions)
- `GET /exhibitions` - получить все выставки
- `POST /exhibitions` - создать выставку
- `PUT /exhibitions/:id` - обновить
- `DELETE /exhibitions/:id` - удалить

### Художники (Artists)
- `GET /artists`
- `POST /artists`
- `PUT /artists/:id`
- `DELETE /artists/:id`

### Новости (News)
- `GET /news`
- `POST /news`
- `PUT /news/:id`
- `DELETE /news/:id`

### Магазин (Shop)
- `GET /shop`
- `POST /shop`
- `PUT /shop/:id`
- `DELETE /shop/:id`

### Заказы (Orders)
- `GET /orders`
- `POST /orders`
- `PUT /orders/:id`
- `DELETE /orders/:id`

## 🔧 Конфигурация

Файл `.env` в корне проекта:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📖 Использование API

### Из Frontend (TypeScript):
```typescript
import { getPaintings, createPainting } from '@/api/client';

// Получить все картины
const paintings = await getPaintings();

// Создать новую картину
const newPainting = await createPainting({
  title: 'Закат',
  artist: 'Иван Иванов',
  price: 150000,
  image: 'https://example.com/image.jpg'
});
```

### Из curl:
```bash
# Получить все картины
curl http://localhost:3001/api/paintings

# Создать картину
curl -X POST http://localhost:3001/api/paintings \
  -H "Content-Type: application/json" \
  -d '{"title":"Новая картина","artist":"Художник","price":50000}'

# Обновить картину
curl -X PUT http://localhost:3001/api/paintings/abc-123 \
  -H "Content-Type: application/json" \
  -d '{"price":60000}'

# Удалить картину
curl -X DELETE http://localhost:3001/api/paintings/abc-123
```

## 🎨 Возможности

- ✅ Полноценный REST API для всех сущностей
- ✅ CRUD операции (Create, Read, Update, Delete)
- ✅ Автоматическая генерация ID для новых записей
- ✅ Хранение данных в JSON файлах
- ✅ CORS настроен для работы с любыми источниками
- ✅ Адаптивный дизайн с мобильным меню
- ✅ Каталог картин
- ✅ Управление выставками
- ✅ Новости
- ✅ Магазин
- ✅ Корзина и заказы

## 📝 Документация

Полная документация доступна в файле [SETUP.md](./SETUP.md)

Backend документация: [backend/README.md](./backend/README.md)

## 🔥 Production

### Build Frontend:
```bash
npm run build
npm run preview
```

### Deploy:
Статические файлы будут в папке `dist/`

## 💡 Разработка

При разработке оба сервера должны быть запущены:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5175

Frontend автоматически обращается к backend через настройки в `.env`

## 🐛 Troubleshooting

**Порт занят:**
- Backend: измените PORT в `backend/server.js`
- Frontend: Vite автоматически найдет свободный порт

**CORS ошибки:**
- Убедитесь что backend запущен
- Проверьте что URL в `.env` правильный

**Данные не сохраняются:**
- Проверьте что папка `backend/data/` доступна для записи
- Убедитесь что backend запущен

## 📄 Лицензия

ISC

## 👤 Автор

Begilda Gallery Team

- GET /exhibitions
  - Response 200:
```json
[{"id":"e1","title":"Solo Show","status":"current","location":"Gallery","startDate":"2026-01-10","endDate":"2026-02-10","image":"/assets/e1.jpg","description":"..."}]
```

- GET /news
  - Response 200: list of news items (id,title,excerpt,image,instagramUrl,date)

- Cart endpoints
  - POST /cart (create/update), GET /cart, DELETE /cart/:itemId
  - Cart item shape: { itemId, type: 'painting'|'shop', quantity, unitPrice }

- Orders
  - POST /orders — create order; expect body with cart items and customer info; return 201 with order id
  - GET /orders/:id — retrieve order status

- Authentication (if used)
  - Support token-based auth (Bearer) or cookie sessions. The frontend currently has no auth UI — discuss if required.

## CORS and Security
-- Allow the frontend origin in CORS policy for dev (or use `*` for quick local testing).
- If using cookies for auth, ensure `SameSite`/`Secure` settings are compatible with the frontend host.

## Frontend integration notes
- `VITE_API_BASE_URL` should point to the API; frontend will call that base. Search for `VITE_API_BASE_URL` in the code and wire fetch calls accordingly (not all components call the API yet — client stubs may be added).
- CSS grid behaviour is controlled by variables in `src/styles/main.css`:
  - `--site-gutter` — site side padding
  - `--grid-min` — standard minimum column width
  - `--grid-min-painting` — catalog painting min width
  Changing these affects layout globally.

## Files of interest
- Components: `src/app/components/*` (Header.tsx, HeaderDark.tsx, Hero.tsx, PaintingCard.tsx, FeaturedPaintings.tsx, NewsList.tsx)
- Pages: `src/app/pages/*` (Home.tsx, Catalog.tsx, Exhibitions.tsx, NewsList.tsx)
- Styles: `src/styles/main.css`
- Mock data: `src/data/paintings.ts`, `src/data/orders.ts`

## Build & Deploy recommendations
- Serve the static build (`dist/`) from any static host (Netlify, Vercel, Nginx). If server-side rendering is planned, adapt accordingly.
- For production, set `VITE_API_BASE_URL` to the API production URL and ensure CORS and auth are configured.

## Handoff checklist (quick)
- [ ] Provide backend base URL and working endpoints matching the shapes above.
- [ ] Confirm auth approach (token vs cookie) and update frontend accordingly.
- [ ] Provide sample responses and any required error shapes.
- [ ] Provide images and asset paths or mount an assets endpoint.
- [ ] Run a production build test with the real API and report any client errors.

## Next steps I can do for you
- Generate a minimal OpenAPI (yaml) spec for the endpoints above.
- Add a small `src/api/client.ts` with fetch/axios stubs wired to `VITE_API_BASE_URL`.
- Create a tiny mock-server (json-server or msw) to simulate the API locally.

If you want the README extended with an OpenAPI file or the API client stubs, tell me which one and I'll add it.

  # Artist Portfolio Website

  This is a code bundle for Artist Portfolio Website. The original project is available at https://www.figma.com/design/r768J7GmkAZqgefhNqFNIs/Artist-Portfolio-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  