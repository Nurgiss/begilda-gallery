#!/bin/bash

# 🚀 Quick Deploy Checklist
# Run this before deploying to production

echo "📋 Pre-Deployment Checklist"
echo "============================"
echo ""

# Check git status
echo "1️⃣  Checking Git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Uncommitted changes found!"
    git status --short
    exit 1
else
    echo "✅ All changes committed"
fi

# Check if up to date with remote
echo ""
echo "2️⃣  Checking remote sync..."
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ $LOCAL = $REMOTE ]; then
    echo "✅ Up to date with remote"
else
    echo "❌ Local differs from remote"
    echo "Run: git pull origin main"
    exit 1
fi

# Run tests
echo ""
echo "3️⃣  Running feature tests..."
cd backend
node scripts/test-new-features.js
TEST_RESULT=$?
cd ..

if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "❌ Tests failed"
    exit 1
fi

# Check if backend is running
echo ""
echo "4️⃣  Checking services..."
if curl -s http://localhost:3001/api/paintings > /dev/null; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend is not running"
fi

if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "⚠️  Frontend is not running"
fi

# Database backup check
echo ""
echo "5️⃣  Checking backups..."
BACKUP_COUNT=$(ls -1 backend/data/gallery.db.backup.* 2>/dev/null | wc -l)
if [ $BACKUP_COUNT -gt 0 ]; then
    echo "✅ Database backups exist ($BACKUP_COUNT)"
    echo "   Latest: $(ls -t backend/data/gallery.db.backup.* | head -1)"
else
    echo "⚠️  No backups found. Creating one..."
    cd backend/data
    cp gallery.db "gallery.db.backup.$(date +%s)"
    cd ../..
    echo "✅ Backup created"
fi

echo ""
echo "================================"
echo "✨ Ready to deploy!"
echo ""
echo "📝 To deploy to production:"
echo "   ./deploy.sh"
echo ""
echo "Or manually follow DEPLOYMENT.md"
echo "================================"
