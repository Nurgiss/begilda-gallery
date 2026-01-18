# Begilda Gallery - Руководство по запуску

## Быстрый старт

### 1. Запуск Backend API

```bash
# Перейти в папку backend
cd backend

# Установить зависимости (только первый раз)
npm install

# Запустить сервер
npm start
```

Backend запустится на **http://localhost:3001**

### 2. Запуск Frontend

```bash
# Из корневой папки проекта
npm install  # только первый раз
npm run dev
```

Frontend запустится на **http://localhost:5175** (или другом свободном порту)

## Архитектура

```
Artist Portfolio Website3/
├── backend/               # Node.js API сервер
│   ├── server.js         # Основной файл сервера
│   ├── data/             # JSON файлы с данными
│   │   ├── paintings.json
│   │   ├── exhibitions.json
│   │   ├── artists.json
│   │   ├── news.json
│   │   ├── shop.json
│   │   └── orders.json
│   └── package.json
│
└── src/                  # React Frontend
    ├── api/
    │   └── client.ts     # API клиент для связи с backend
    └── app/
        └── ...
```

## Управление данными

Backend предоставляет REST API для управления всеми данными:

### Доступные эндпоинты:

**Картины (Paintings)**
- GET `/api/paintings` - получить все
- GET `/api/paintings/:id` - получить одну
- POST `/api/paintings` - создать
- PUT `/api/paintings/:id` - обновить
- DELETE `/api/paintings/:id` - удалить

**Выставки (Exhibitions)**
- GET `/api/exhibitions`
- GET `/api/exhibitions/:id`
- POST `/api/exhibitions`
- PUT `/api/exhibitions/:id`
- DELETE `/api/exhibitions/:id`

**Художники (Artists)**
- GET `/api/artists`
- GET `/api/artists/:id`
- POST `/api/artists`
- PUT `/api/artists/:id`
- DELETE `/api/artists/:id`

**Новости (News)**
- GET `/api/news`
- GET `/api/news/:id`
- POST `/api/news`
- PUT `/api/news/:id`
- DELETE `/api/news/:id`

**Магазин (Shop)**
- GET `/api/shop`
- GET `/api/shop/:id`
- POST `/api/shop`
- PUT `/api/shop/:id`
- DELETE `/api/shop/:id`

**Заказы (Orders)**
- GET `/api/orders`
- GET `/api/orders/:id`
- POST `/api/orders`
- PUT `/api/orders/:id`
- DELETE `/api/orders/:id`

## Примеры использования API

### Создать картину:
```javascript
const response = await fetch('http://localhost:3001/api/paintings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Закат над морем',
    artist: 'Иван Иванов',
    year: 2024,
    price: 150000,
    image: 'https://example.com/sunset.jpg',
    description: 'Красивая картина',
    dimensions: '100x80 см',
    medium: 'Масло на холсте'
  })
});
const painting = await response.json();
```

### Обновить картину:
```javascript
await fetch('http://localhost:3001/api/paintings/abc-123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    price: 180000  // изменить только цену
  })
});
```

### Удалить картину:
```javascript
await fetch('http://localhost:3001/api/paintings/abc-123', {
  method: 'DELETE'
});
```

## Использование из Frontend

Frontend уже настроен для работы с backend через файл `src/api/client.ts`:

```typescript
import { getPaintings, createPainting, updatePainting, deletePainting } from '@/api/client';

// Получить все картины
const paintings = await getPaintings();

// Создать картину
const newPainting = await createPainting({
  title: 'Новая работа',
  artist: 'Художник',
  price: 50000
});

// Обновить
await updatePainting('id-123', { price: 60000 });

// Удалить
await deletePainting('id-123');
```

## Хранилище данных

Все данные хранятся в JSON файлах в папке `backend/data/`. Вы можете редактировать их вручную или через API.

## Настройка

Файл `.env` в корне проекта содержит URL backend:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Troubleshooting

**Порт занят:**
- Backend работает на порту 3001
- Frontend автоматически найдет свободный порт (обычно 5173-5175)

**CORS ошибки:**
- Backend уже настроен для работы с любыми источниками
- Убедитесь, что backend запущен

**Данные не сохраняются:**
- Проверьте права доступа к папке `backend/data/`
- Убедитесь что backend запущен и работает
