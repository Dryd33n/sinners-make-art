
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";


require('dotenv').config();
config({
  path: '.env.local',
});


if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL must be a Neon postgres connection string url: ' + process.env.NEON_DATABASE_URL);
}


const sql = neon(process.env.NEON_DATABASE_URL!);


export const getDBVersion = async() => {
    const sql = neon(process.env.NEON_DATABASE_URL!);
    const response = await sql`SELECT version()`;
    return { version: response[0].version }
}

export const db = drizzle({ client: sql});
