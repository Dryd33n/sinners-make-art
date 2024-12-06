import type { Config } from 'drizzle-kit';
import * as dotenv from "dotenv";

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: '.env.local',
});

if (!process.env.NEON_DATABASE_URL) throw new Error('NEON DATABASE_URL not found in environment');

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL!,
  },
});