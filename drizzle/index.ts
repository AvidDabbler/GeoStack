import { drizzle as _drizzle } from 'drizzle-orm/node-postgres'
import * as _drizzleValues from '../drizzle/schema'
import type * as _drizzleTypes from '../drizzle/schema'
import { Pool } from 'pg'

require('dotenv').config()
if (!process.env.DATABASE_URL) throw Error('No database url found')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const database = _drizzle(pool)

const { tables, ...drizzleValues } = _drizzleValues
export { _drizzleTypes as drizzleTypes }
export { tables, drizzleValues }
