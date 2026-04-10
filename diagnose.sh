#!/bin/bash

# 🔍 Диагностика проблем с функционалом "Скрыть"

echo "🔍 ДИАГНОСТИКА ФУНКЦИОНАЛА"
echo "=========================="
echo ""

# Проверка 1: База данных
echo "1️⃣ Проверка структуры базы данных..."
echo "--------------------------------------"
sqlite3 backend/data/gallery.db "PRAGMA table_info(paintings);" | grep hidden
if [ $? -eq 0 ]; then
    echo "✅ Поле 'hidden' есть в таблице paintings"
else
    echo "❌ Поле 'hidden' ОТСУТСТВУЕТ в таблице paintings"
    echo "   Решение: cd backend && npx prisma db push"
fi

sqlite3 backend/data/gallery.db "PRAGMA table_info(shop_items);" | grep availability
if [ $? -eq 0 ]; then
    echo "✅ Поле 'availability' есть в таблице shop_items"
else
    echo "❌ Поле 'availability' ОТСУТСТВУЕТ в таблице shop_items"
    echo "   Решение: cd backend && npx prisma db push"
fi

echo ""

# Проверка 2: Backend API
echo "2️⃣ Проверка Backend API..."
echo "--------------------------------------"
API_RESPONSE=$(curl -s http://localhost:3001/api/paintings 2>/dev/null)
if [ -z "$API_RESPONSE" ]; then
    echo "❌ Backend не отвечает на http://localhost:3001"
    echo "   Решение: cd backend && npm start"
else
    if echo "$API_RESPONSE" | grep -q '"hidden"'; then
        echo "✅ API возвращает поле 'hidden'"
    else
        echo "❌ API НЕ возвращает поле 'hidden'"
        echo "   Решение: cd backend && npx prisma generate && npm start"
    fi
    
    if echo "$API_RESPONSE" | grep -q '"availability"'; then
        echo "✅ API возвращает поле 'availability' для paintings"
    fi
fi

SHOP_RESPONSE=$(curl -s http://localhost:3001/api/shop 2>/dev/null)
if [ ! -z "$SHOP_RESPONSE" ]; then
    if echo "$SHOP_RESPONSE" | grep -q '"availability"'; then
        echo "✅ API возвращает поле 'availability' для shop"
    else
        echo "❌ API НЕ возвращает поле 'availability' для shop"
    fi
fi

echo ""

# Проверка 3: Frontend
echo "3️⃣ Проверка Frontend..."
echo "--------------------------------------"
if [ -d "dist" ]; then
    BUILT_DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" dist 2>/dev/null || stat -c "%y" dist 2>/dev/null | cut -d' ' -f1,2)
    echo "✅ Frontend собран (дата: $BUILT_DATE)"
    echo "   Если изменения не видны, пересоберите: npm run build"
else
    echo "❌ Frontend не собран"
    echo "   Решение: npm run build"
fi

echo ""

# Проверка 4: Данные в базе
echo "4️⃣ Проверка данных в базе..."
echo "--------------------------------------"
HIDDEN_COUNT=$(sqlite3 backend/data/gallery.db "SELECT COUNT(*) FROM paintings WHERE hidden = 1;" 2>/dev/null)
TOTAL_PAINTINGS=$(sqlite3 backend/data/gallery.db "SELECT COUNT(*) FROM paintings;" 2>/dev/null)
echo "📊 Картины: всего $TOTAL_PAINTINGS, скрыто $HIDDEN_COUNT"

SOLD_COUNT=$(sqlite3 backend/data/gallery.db "SELECT COUNT(*) FROM shop_items WHERE availability = 0;" 2>/dev/null)
TOTAL_SHOP=$(sqlite3 backend/data/gallery.db "SELECT COUNT(*) FROM shop_items;" 2>/dev/null)
echo "📊 Товары: всего $TOTAL_SHOP, продано $SOLD_COUNT"

echo ""

# Проверка 5: Браузер
echo "5️⃣ Проверка в браузере (выполните вручную)..."
echo "--------------------------------------"
echo "1. Откройте http://localhost:5173/admin"
echo "2. Войдите в админку"
echo "3. Откройте Paintings → попробуйте редактировать картину"
echo "4. Проверьте, есть ли чекбокс '🚫 Скрыть'"
echo ""
echo "Если чекбокса НЕТ:"
echo "   - Нажмите Ctrl+Shift+R (принудительное обновление)"
echo "   - Или очистите кэш браузера"
echo "   - Или пересоберите: npm run build && npm run preview"
echo ""
echo "Если чекбокс ЕСТЬ, но не сохраняется:"
echo "   - Откройте DevTools (F12)"
echo "   - Перейдите на вкладку Console"
echo "   - Попробуйте сохранить → скопируйте ошибку"
echo "   - Перейдите на вкладку Network"
echo "   - Попробуйте сохранить → найдите запрос PUT /api/paintings/..."
echo "   - Посмотрите Response"
echo ""

# Проверка 6: Логи
echo "6️⃣ Проверка логов Backend..."
echo "--------------------------------------"
if command -v pm2 &> /dev/null; then
    echo "Backend логи (последние 10 строк):"
    pm2 logs begilda-backend --lines 10 --nostream 2>/dev/null || echo "PM2 процесс не найден"
else
    echo "⚠️  PM2 не установлен, логи смотрите в терминале где запущен backend"
fi

echo ""
echo "================================"
echo "✨ Диагностика завершена!"
echo ""
echo "📝 Для проверки на СЕРВЕРЕ:"
echo "   1. Подключитесь: ssh ubuntu@IP"
echo "   2. Запустите этот скрипт там"
echo ""
echo "🐛 Если проблема остается:"
echo "   1. Проверьте браузерную консоль (F12)"
echo "   2. Проверьте Network вкладку при сохранении"
echo "   3. Проверьте логи backend"
echo "================================"
