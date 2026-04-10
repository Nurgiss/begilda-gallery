#!/usr/bin/env node

/**
 * Script to add test data for shop availability and painting hidden features
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTestData() {
  console.log('🧪 Adding test data...\n');

  try {
    // Add a sold shop item
    const soldShop = await prisma.shopItem.create({
      data: {
        title: 'TEST - Sold Out Poster',
        price: 5000,
        priceUsd: 10,
        priceEur: 9,
        category: 'Posters',
        description: 'This is a test item marked as SOLD OUT',
        image: 'http://localhost:3001/uploads/test.jpg',
        availability: false, // SOLD OUT
      }
    });
    console.log('✅ Created SOLD OUT shop item:', soldShop.title);

    // Add an available shop item
    const availableShop = await prisma.shopItem.create({
      data: {
        title: 'TEST - Available Print',
        price: 7500,
        priceUsd: 15,
        priceEur: 13,
        category: 'Prints',
        description: 'This is a test item marked as AVAILABLE',
        image: 'http://localhost:3001/uploads/test.jpg',
        availability: true, // AVAILABLE
      }
    });
    console.log('✅ Created AVAILABLE shop item:', availableShop.title);

    // Add a hidden painting
    const hiddenPainting = await prisma.painting.create({
      data: {
        title: 'TEST - Hidden Artwork',
        artistName: 'Test Artist',
        year: '2026',
        price: 150000,
        priceUsd: 300,
        priceEur: 260,
        dimensions: '80x60 cm',
        medium: 'Oil on canvas',
        category: 'abstract',
        description: 'This painting is HIDDEN from public view',
        image: 'http://localhost:3001/uploads/test.jpg',
        availability: true,
        featured: false,
        exhibitionOnly: false,
        hidden: true, // HIDDEN
      }
    });
    console.log('✅ Created HIDDEN painting:', hiddenPainting.title);

    // Add a visible painting
    const visiblePainting = await prisma.painting.create({
      data: {
        title: 'TEST - Visible Artwork',
        artistName: 'Test Artist',
        year: '2026',
        price: 200000,
        priceUsd: 400,
        priceEur: 345,
        dimensions: '100x80 cm',
        medium: 'Acrylic on canvas',
        category: 'modern',
        description: 'This painting is VISIBLE to everyone',
        image: 'http://localhost:3001/uploads/test.jpg',
        availability: true,
        featured: true,
        exhibitionOnly: false,
        hidden: false, // VISIBLE
      }
    });
    console.log('✅ Created VISIBLE painting:', visiblePainting.title);

    console.log('\n✨ Test data added successfully!');
    console.log('\n📝 Summary:');
    console.log('   - 1 sold out shop item');
    console.log('   - 1 available shop item');
    console.log('   - 1 hidden painting');
    console.log('   - 1 visible painting');
    
    return {
      soldShop,
      availableShop,
      hiddenPainting,
      visiblePainting
    };
  } catch (error) {
    console.error('❌ Error adding test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addTestData().catch(console.error);
