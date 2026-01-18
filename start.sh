#!/bin/bash

echo "🎨 Запуск Begilda Gallery..."
echo ""

# Проверка и запуск backend
if [ -d "backend" ]; then
    echo "📊 Запуск Backend API на порту 3001..."
    cd backend
    
    # Проверка установлены ли зависимости
    if [ ! -d "node_modules" ]; then
        echo "📦 Установка зависимостей backend..."
        npm install
    fi
    
    # Запуск backend в фоне
    npm start &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend запущен (PID: $BACKEND_PID)"
else
    echo "❌ Папка backend не найдена"
    exit 1
fi

sleep 2

# Запуск frontend
echo ""
echo "🌐 Запуск Frontend..."

# Проверка установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей frontend..."
    npm install
fi

echo "✅ Запуск dev сервера..."
npm run dev

# Cleanup при завершении
trap "kill $BACKEND_PID" EXIT
