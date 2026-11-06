require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, seedDatabase } = require('./config/db');

async function runSeed() {
  console.log('--- Starting CareerPath Database Seeding ---');
  try {
    await connectDB();
    await seedDatabase();
    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('--- Seeding Failed ---', error);
    process.exit(1);
  }
}

runSeed();

