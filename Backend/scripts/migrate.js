import dotenv from "dotenv";
dotenv.config();

import { runMigrations } from '../utils/migrate.js';

runMigrations()
  .then(() => {
    console.log('Migration process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });

