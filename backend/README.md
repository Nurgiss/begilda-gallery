# Begilda Gallery Backend API

Backend сервер для управления данными галереи.

## Установка

```bash
cd backend
npm install
```

## Запуск

### Development режим (с автоперезагрузкой):
```bash
npm run dev
```

### Production режим:
```bash
npm start
```

Сервер запустится на `http://localhost:3001`

## API Endpoints

### Paintings (Картины)
- `GET /api/paintings` - Получить все картины
- `GET /api/paintings/:id` - Получить картину по ID
- `POST /api/paintings` - Создать картину
- `PUT /api/paintings/:id` - Обновить картину
- `DELETE /api/paintings/:id` - Удалить картину

### Exhibitions (Выставки)
- `GET /api/exhibitions` - Получить все выставки
- `GET /api/exhibitions/:id` - Получить выставку по ID
- `POST /api/exhibitions` - Создать выставку
- `PUT /api/exhibitions/:id` - Обновить выставку
- `DELETE /api/exhibitions/:id` - Удалить выставку

### Artists (Художники)
- `GET /api/artists` - Получить всех художников
- `GET /api/artists/:id` - Получить художника по ID
- `POST /api/artists` - Создать художника
- `PUT /api/artists/:id` - Обновить художника
- `DELETE /api/artists/:id` - Удалить художника

### News (Новости)
- `GET /api/news` - Получить все новости
- `GET /api/news/:id` - Получить новость по ID
- `POST /api/news` - Создать новость
- `PUT /api/news/:id` - Обновить новость
- `DELETE /api/news/:id` - Удалить новость

### Shop (Магазин)
- `GET /api/shop` - Получить все товары
- `GET /api/shop/:id` - Получить товар по ID
- `POST /api/shop` - Создать товар
- `PUT /api/shop/:id` - Обновить товар
- `DELETE /api/shop/:id` - Удалить товар

### Orders (Заказы)
- `GET /api/orders` - Получить все заказы
- `GET /api/orders/:id` - Получить заказ по ID
- `POST /api/orders` - Создать заказ
- `PUT /api/orders/:id` - Обновить заказ
- `DELETE /api/orders/:id` - Удалить заказ

## Хранение данных

### База данных
Проект использует **Prisma ORM** с поддержкой SQLite (разработка) и PostgreSQL (продакшн).

**Схема**: [prisma/schema.prisma](prisma/schema.prisma)

### Миграция данных

Для импорта данных из JSON файлов в базу данных:
```bash
npm run db:migrate
```

**На новом сервере (первый запуск)**:
```bash
npx prisma generate   # Генерация Prisma Client
npx prisma db push    # Создание таблиц
npm run db:migrate    # Импорт данных из JSON
```

Исходные JSON файлы в папке `backend/data/`:
- `paintings.json` - картины
- `exhibitions.json` - выставки
- `artists.json` - художники
- `news.json` - новости
- `shop.json` - товары магазина
- `orders.json` - заказы
- `pickupPoints.json` - пункты выдачи

### Переключение SQLite ↔ PostgreSQL

Измените `DATABASE_URL` в `.env`:

**SQLite** (разработка):
```
DATABASE_URL="file:./data/gallery.db"
```

**PostgreSQL** (продакшн):
```
DATABASE_URL="postgresql://user:password@localhost:5432/begilda_gallery"
```

Затем: `npx prisma migrate deploy`

## Пример использования

### Создать картину:
```javascript
const response = await fetch('http://localhost:3001/api/paintings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Sunset',
    artist: 'John Doe',
    year: 2024,
    price: 5000,
    image: 'https://example.com/image.jpg'
  })
});
const painting = await response.json();
```

### Обновить картину:
```javascript
const response = await fetch('http://localhost:3001/api/paintings/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    price: 6000
  })
});
```

### Удалить картину:
```javascript
await fetch('http://localhost:3001/api/paintings/123', {
  method: 'DELETE'
});
```
