import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { users, aiUsers, userFacts } from '../../../database/schema'
import ParseEnvVariablesService from '../services/ParseEnvVariablesService'

const { db: dbConfig } = new ParseEnvVariablesService().handle(process.env)

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
})

const db = drizzle(pool, { schema: { users, aiUsers, userFacts }, casing: 'snake_case' })

export default db
