/**
 * CC Immune — Application Main Entry Point
 * Starts the Web Hub / API server on port 3000 and initializes background services.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { startServer } from './api/server.js';
import { ERROR_CODEX } from './core/errors/codex.js';

dotenv.config();

console.log('----------------------------------------------------');
console.log('🛡️  CC Immune — Immune to CC. Built for the Land of Dawn.');
console.log('----------------------------------------------------');

// 1. Boot Express Web Hub & API Server (Listens on 0.0.0.0:3000)
startServer();

// 2. Database Connection Handling (Graceful Fallback)
if (process.env.MONGO_URI) {
  mongoose.set('bufferCommands', false);
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log('🟢 [Database] Connected to MongoDB Atlas successfully.'))
  .catch(err => {
    console.warn('⚠️  [Database] MongoDB offline or unreachable:', err.message);
    console.warn('💡 [Database] DB-002: Falling back to in-memory JSON hero cache.');
  });
} else {
  console.log('ℹ️  [Database] DB-001: MONGO_URI not specified. Using grounded in-memory hero cache.');
}

// 3. Discord Bot Client Initialization Guard
if (!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN.trim() === '') {
  console.log('ℹ️  [Discord] CFG-001: DISCORD_TOKEN not provided. Web Hub & API Server running in standalone mode.');
  console.log('💡 [Discord] To connect live Discord Bot, populate DISCORD_TOKEN in environment variables.');
} else {
  console.log('🟢 [Discord] DISCORD_TOKEN detected. Attempting gateway login...');
}

process.on('unhandledRejection', (reason) => {
  console.warn('⚠️  [System] Unhandled Rejection:', reason);
});
