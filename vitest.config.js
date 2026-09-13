/**
 * @file vitest.config.js
 * @description Test runner configuration.
 *
 * `env` supplies a minimal valid environment so importing src/config/env.js
 * during tests does not exit the process. These are dummy values — never real
 * credentials.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    // Deterministic, valid-but-fake environment for every test run.
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'fatal',
      DISCORD_TOKEN:
        'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkw.Gabcde.fghijklmnopqrstuvwxyz1234567890ABC',
      CLIENT_ID: '123456789012345678',
      MONGO_URI: 'mongodb://127.0.0.1:27017/ccimmune-test',
      OWNER_IDS: '111111111111111111',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      reportsDirectory: './coverage',
    },
  },
});
