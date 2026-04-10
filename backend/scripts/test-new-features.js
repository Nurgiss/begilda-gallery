#!/usr/bin/env node

/**
 * Test script for Shop availability and Painting hidden features
 * Tests: Database schema, API responses, and data integrity
 */

const BASE_URL = 'http://localhost:3001/api';

async function testShopAvailability() {
  console.log('\n🛍️  Testing Shop Availability Feature...');
  
  try {
    const response = await fetch(`${BASE_URL}/shop`);
    const shops = await response.json();
    
    if (shops.length === 0) {
      console.log('⚠️  No shop items found in database');
      return;
    }
    
    // Check if availability field exists
    const firstShop = shops[0];
    if ('availability' in firstShop) {
      console.log('✅ Shop items have "availability" field');
      console.log(`   Sample: ${firstShop.title} - availability: ${firstShop.availability}`);
      
      // Count available vs sold
      const available = shops.filter(s => s.availability !== false).length;
      const sold = shops.filter(s => s.availability === false).length;
      console.log(`   📊 Stats: ${available} available, ${sold} sold out`);
    } else {
      console.log('❌ Shop items missing "availability" field!');
    }
  } catch (error) {
    console.log('❌ Error testing shop:', error.message);
  }
}

async function testPaintingHidden() {
  console.log('\n🎨 Testing Painting Hidden Feature...');
  
  try {
    const response = await fetch(`${BASE_URL}/paintings`);
    const paintings = await response.json();
    
    if (paintings.length === 0) {
      console.log('⚠️  No paintings found in database');
      return;
    }
    
    // Check if hidden field exists
    const firstPainting = paintings[0];
    if ('hidden' in firstPainting) {
      console.log('✅ Paintings have "hidden" field');
      console.log(`   Sample: ${firstPainting.title} - hidden: ${firstPainting.hidden}`);
      
      // Count visible vs hidden
      const visible = paintings.filter(p => p.hidden !== true).length;
      const hidden = paintings.filter(p => p.hidden === true).length;
      const exhibitionOnly = paintings.filter(p => p.exhibitionOnly === true).length;
      console.log(`   📊 Stats: ${visible} visible, ${hidden} hidden, ${exhibitionOnly} exhibition-only`);
    } else {
      console.log('❌ Paintings missing "hidden" field!');
    }
  } catch (error) {
    console.log('❌ Error testing paintings:', error.message);
  }
}

async function testDatabaseSchema() {
  console.log('\n💾 Testing Database Schema...');
  
  const { execSync } = await import('child_process');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  try {
    const dbPath = path.join(__dirname, '..', 'data', 'gallery.db');
    
    // Check shop_items table
    const shopSchema = execSync(
      `sqlite3 "${dbPath}" ".schema shop_items"`,
      { encoding: 'utf8' }
    );
    
    if (shopSchema.includes('availability')) {
      console.log('✅ shop_items table has "availability" column');
    } else {
      console.log('❌ shop_items table missing "availability" column!');
    }
    
    // Check paintings table
    const paintingsSchema = execSync(
      `sqlite3 "${dbPath}" ".schema paintings"`,
      { encoding: 'utf8' }
    );
    
    if (paintingsSchema.includes('hidden')) {
      console.log('✅ paintings table has "hidden" column');
    } else {
      console.log('❌ paintings table missing "hidden" column!');
    }
    
    // Check indexes
    if (shopSchema.includes('availability_idx')) {
      console.log('✅ shop_items has availability index');
    }
    if (paintingsSchema.includes('hidden_idx')) {
      console.log('✅ paintings has hidden index');
    }
    
  } catch (error) {
    console.log('❌ Error checking database schema:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Starting Feature Tests...');
  console.log('=' .repeat(50));
  
  await testDatabaseSchema();
  await testShopAvailability();
  await testPaintingHidden();
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Tests completed!\n');
}

// Run tests
runTests().catch(console.error);
