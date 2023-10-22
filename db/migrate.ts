import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

export const migration = async () => {
  if (!process.env.DATABASE_URL) throw Error('No database url found')
  const sql = postgres(process.env.DATABASE_URL, { max: 1 })
  const db = drizzle(sql)
  await migrate(db, { migrationsFolder: '../drizzle/migrations' })
}

migration()
