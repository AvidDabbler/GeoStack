import type { Config } from "drizzle-kit";
 
export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: 'pg',
  dbCredentials: {
    connectionString: "postgresql://postgres:postgres@localhost:5442/postgres",
  }
} satisfies Config;
