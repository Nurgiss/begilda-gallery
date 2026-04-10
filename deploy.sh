#!/bin/bash

# 🚀 Deployment Script for Begilda Gallery
# Deploys updates to production with database migration

set -e  # Exit on error

echo "🎨 Begilda Gallery - Production Deployment"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from project root${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment Checklist:${NC}"
echo "  1. ✅ Code pushed to GitHub"
echo "  2. ⏳ Pulling latest changes..."
echo ""

# Pull latest changes
git pull origin main

echo -e "${GREEN}✅ Code updated${NC}"
echo ""

# Backend deployment
echo -e "${YELLOW}🔧 Backend Deployment${NC}"
echo "--------------------"

cd backend

echo "📦 Installing backend dependencies..."
npm install --production

echo "🗄️  Applying database migrations..."
npx prisma generate
npx prisma db push  # For SQLite; use 'npx prisma migrate deploy' for PostgreSQL

echo "🏗️  Building backend..."
npm run build

echo -e "${GREEN}✅ Backend deployed${NC}"
echo ""

cd ..

# Frontend deployment
echo -e "${YELLOW}🎨 Frontend Deployment${NC}"
echo "---------------------"

echo "📦 Installing frontend dependencies..."
npm install --production

echo "🏗️  Building frontend..."
npm run build

echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Restart services (adjust based on your hosting)
echo -e "${YELLOW}🔄 Restarting Services${NC}"
echo "----------------------"

# If using PM2
if command -v pm2 &> /dev/null; then
    echo "Restarting backend with PM2..."
    cd backend
    pm2 restart begilda-backend || pm2 start npm --name "begilda-backend" -- start
    cd ..
    
    echo "Restarting frontend with PM2..."
    pm2 restart begilda-frontend || pm2 start npm --name "begilda-frontend" -- run preview
else
    echo -e "${YELLOW}⚠️  PM2 not found. Please restart services manually:${NC}"
    echo "   Backend: cd backend && npm start"
    echo "   Frontend: npm run preview"
fi

echo ""
echo -e "${GREEN}✨ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Your gallery is updated:"
echo "   - Backend: http://your-domain:3001"
echo "   - Frontend: http://your-domain"
echo ""
echo "📊 New Features Deployed:"
echo "   ✅ Shop availability status (In Stock/Sold Out)"
echo "   ✅ Painting hidden feature"
echo ""
