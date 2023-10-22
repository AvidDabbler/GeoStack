import { drizzle as _drizzle } from 'drizzle-orm/node-postgres'
import * as _drizzleValues from '../drizzle/schema'
import type * as _drizzleTypes from '../drizzle/schema'
import { Pool } from 'pg'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) throw Error('No database url found')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const drizzle = _drizzle(pool)
export const database = drizzle

const { tables, ...drizzleValues } = _drizzleValues
export { _drizzleTypes as drizzleTypes }
export { tables, drizzleValues }
