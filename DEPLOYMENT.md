# 🚀 Production Deployment Guide

## Что было обновлено

### Новые функции:
1. **Shop Availability** - статус "В наличии" / "Продано" для товаров магазина
2. **Painting Hidden** - возможность скрыть картины без удаления

### Изменения в базе данных:
- Добавлено поле `availability` в таблицу `shop_items`
- Добавлено поле `hidden` в таблицу `paintings`
- Созданы индексы для оптимизации

## 📋 Пошаговая инструкция по деплою

### Вариант 1: Автоматический деплой (рекомендуется)

```bash
./deploy.sh
```

Скрипт автоматически:
- ✅ Подтянет последние изменения из Git
- ✅ Установит зависимости
- ✅ Применит миграции базы данных
- ✅ Соберет фронтенд и бэкенд
- ✅ Перезапустит сервисы

### Вариант 2: Ручной деплой

#### Шаг 1: Подготовка

```bash
# Создайте бэкап базы данных (ВАЖНО!)
cd backend/data
cp gallery.db gallery.db.backup.$(date +%s)
cd ../..

# Подтяните последние изменения
git pull origin main
```

#### Шаг 2: Backend

```bash
cd backend

# Установите зависимости
npm install

# Примените изменения схемы к базе данных
npx prisma generate
npx prisma db push

# Соберите backend
npm run build

# Перезапустите backend
# Для PM2:
pm2 restart begilda-backend

# Или вручную:
# Ctrl+C для остановки старого процесса
npm start
```

#### Шаг 3: Frontend

```bash
cd ..  # Вернитесь в корневую папку

# Установите зависимости
npm install

# Соберите frontend
npm run build

# Перезапустите frontend
# Для PM2:
pm2 restart begilda-frontend

# Или вручную для продакшн превью:
npm run preview
```

## 🔍 Проверка после деплоя

### 1. Проверьте Backend API:

```bash
# Проверьте shop items (должно быть поле availability)
curl http://localhost:3001/api/shop | jq '.[0]'

# Проверьте paintings (должно быть поле hidden)
curl http://localhost:3001/api/paintings | jq '.[0]'
```

Должны увидеть новые поля:
```json
{
  "id": "...",
  "title": "...",
  "availability": true,  // ← новое поле
  ...
}
```

```json
{
  "id": "...",
  "title": "...",
  "hidden": false,  // ← новое поле
  ...
}
```

### 2. Проверьте базу данных:

```bash
cd backend
sqlite3 data/gallery.db "PRAGMA table_info(shop_items);" | grep availability
sqlite3 data/gallery.db "PRAGMA table_info(paintings);" | grep hidden
```

Должно вывести информацию о новых полях.

### 3. Проверьте админку:

1. Откройте `/admin` в браузере
2. Войдите в систему
3. Перейдите в **Shop** → должна быть колонка "Статус"
4. Перейдите в **Paintings** → должна быть колонка "Скрыто"
5. Попробуйте редактировать товар → должна быть секция "Статус"
6. Попробуйте редактировать картину → должен быть чекбокс "🚫 Скрыть"

### 4. Проверьте публичные страницы:

1. `/shop` - убедитесь, что проданные товары не отображаются
2. `/catalog` - убедитесь, что скрытые картины не отображаются
3. Откройте детальную страницу проданного товара → должно быть предупреждение

## 🐛 Troubleshooting

### Проблема: "field not found" ошибка в API

**Решение:**
```bash
cd backend
npx prisma generate
npx prisma db push
npm start
```

### Проблема: Старые данные без новых полей

**Решение:**
Все существующие записи автоматически получат значения по умолчанию:
- `shop_items.availability` = `true` (доступно)
- `paintings.hidden` = `false` (видимо)

Проверьте:
```bash
cd backend
sqlite3 data/gallery.db "UPDATE shop_items SET availability = 1 WHERE availability IS NULL;"
sqlite3 data/gallery.db "UPDATE paintings SET hidden = 0 WHERE hidden IS NULL;"
```

### Проблема: Frontend не показывает изменения

**Решение:**
```bash
# Очистите кэш и пересоберите
rm -rf dist node_modules/.vite
npm run build
```

## 📊 Мониторинг

После деплоя рекомендуется проверить:

1. **Логи Backend:**
   ```bash
   pm2 logs begilda-backend
   # или
   tail -f backend/logs/app.log
   ```

2. **Логи Frontend:**
   ```bash
   pm2 logs begilda-frontend
   ```

3. **Статус сервисов:**
   ```bash
   pm2 status
   ```

## 🔄 Откат изменений (если что-то пошло не так)

### Откат базы данных:

```bash
cd backend/data
# Найдите последний бэкап
ls -lht gallery.db.backup.*

# Восстановите (замените timestamp на ваш)
cp gallery.db.backup.1775812392 gallery.db

# Перезапустите backend
cd ..
pm2 restart begilda-backend
```

### Откат кода:

```bash
# Вернитесь к предыдущему коммиту
git log --oneline  # найдите предыдущий коммит
git checkout <previous-commit-hash>

# Или используйте git revert
git revert HEAD
git push origin main

# Передеплойте
./deploy.sh
```

## ✅ Checklist

После деплоя убедитесь что:

- [ ] Backend стартует без ошибок
- [ ] Frontend собран и доступен
- [ ] API возвращает новые поля
- [ ] Админка показывает новые колонки и контролы
- [ ] Публичные страницы корректно фильтруют данные
- [ ] Бэкап базы данных создан
- [ ] Логи не показывают ошибок

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `pm2 logs`
2. Проверьте статус: `pm2 status`
3. Создайте issue на GitHub с описанием проблемы и логами

---

**Дата обновления:** 10 апреля 2026 г.
**Версия:** 1.1.0
