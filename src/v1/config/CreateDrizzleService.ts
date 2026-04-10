import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { users, aiUsers, userFacts } from '../../../database/schema'
import ParseEnvVariablesService from '../services/ParseEnvVariablesService'

class CreateDrizzleService {
  constructor(private getEnvVariablesService = new ParseEnvVariablesService()) {}

  public handle() {
    const { db } = this.getEnvVariablesService.handle(process.env)

    const pool = new Pool({
      host: db.host,
      port: db.port,
      database: db.database,
      user: db.user,
      password: db.password,
    })

    return drizzle(pool, { schema: { users, aiUsers, userFacts }, casing: 'snake_case' })
  }
}

export default CreateDrizzleService
