import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

console.log("Initializing database connection...");

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let pool: Pool;
let db: ReturnType<typeof drizzle>;

try {
  console.log("Creating database pool...");
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log("Database pool created successfully");

  console.log("Initializing Drizzle ORM...");
  db = drizzle({ client: pool, schema });
  console.log("Drizzle ORM initialized successfully");
} catch (error) {
  console.error("Failed to initialize database:", error);
  throw error;
}

export { pool, db };