const mongoose = require('mongoose');
const CareerTrack = require('../models/CareerTrack');
const Mentor = require('../models/Mentor');
const { careersData, mentorsData } = require('../services/seedData');

let mongodInstance = null;

/**
 * Idempotently seeds the database with 5 inclusive career tracks and 3 mentors
 */
async function seedDatabase() {
  try {
    console.log('[Seed] Ensuring database is seeded with career tracks and mentors...');

    // Upsert Careers
    for (const career of careersData) {
      await CareerTrack.findOneAndUpdate(
        { title: career.title },
        { $set: career },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Upsert Mentors
    for (const mentor of mentorsData) {
      await Mentor.findOneAndUpdate(
        { name: mentor.name },
        { $set: mentor },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const careerCount = await CareerTrack.countDocuments();
    const mentorCount = await Mentor.countDocuments();
    console.log(`[Seed] Database initialized: ${careerCount} careers, ${mentorCount} mentors.`);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err.message);
  }
}

/**
 * Connects to MongoDB via MONGO_URI.
 * If MONGO_URI is missing or connection fails, falls back to mongodb-memory-server and auto-seeds.
 */
async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      console.log('[Database] Connecting to MongoDB via MONGO_URI...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000
      });
      console.log('[Database] Connected to external MongoDB successfully.');

      // Check if auto-seed is needed
      const careerCount = await CareerTrack.countDocuments();
      if (careerCount === 0) {
        console.log('[Database] Database is empty. Auto-seeding...');
        await seedDatabase();
      }
      return;
    } catch (err) {
      console.warn(`[Database] Failed to connect to MONGO_URI: ${err.message}`);
      console.warn('[Database] Falling back to mongodb-memory-server...');
    }
  } else {
    console.log('[Database] MONGO_URI not provided. Starting mongodb-memory-server...');
  }

  // Fallback to mongodb-memory-server
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'careerpath'
      },
      spawn: {
        timeout: 120000
      }
    });
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to in-memory MongoDB at ${memoryUri}`);

    // Auto-seed in-memory database
    await seedDatabase();
  } catch (memoryErr) {
    console.error('[Database] Fatal: Failed to initialize in-memory MongoDB:', memoryErr.message);
    throw memoryErr;
  }
}

module.exports = {
  connectDB,
  seedDatabase
};

