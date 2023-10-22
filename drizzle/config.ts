import type { Config } from "drizzle-kit";
 
export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: 'pg',
  dbCredentials: {
    connectionString: "postgresql://postgres:postgres@localhost:5462/postgres",
  }
} satisfies Config;

// ! issue with drizzle:push
// Warning  Found data-loss statements:
// · You're about to delete _prisma_migrations table with 2 items
// · You're about to change f_table_schema column type from name to ltree with 2 items
// · You're about to set not-null constraint to f_table_schema column without default, which contains 2 items
// · You're about to change f_table_name column type from name to ltree with 2 items
// · You're about to set not-null constraint to f_table_name column without default, which contains 2 items
// · You're about to change f_geometry_column column type from name to ltree with 2 items
// · You're about to set not-null constraint to f_geometry_column column without default, which contains 2 items
// · You're about to change geom column type from geometry(Point,4326) to ltree with 5945 items
// · You're about to set not-null constraint to geom column without default, which contains 5945 items
// · You're about to change geom column type from geometry(LineString,4326) to ltree with 271 items
// · You're about to set not-null constraint to geom column without default, which contains 271 items