import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { users } from '../../../database/schema'
import GetEnvVariablesService from './GetEnvVariablesService'

class CreateDrizzleService {
  constructor(private getEnvVariablesService = new GetEnvVariablesService()) {}

  public handle() {
    const { db } = this.getEnvVariablesService.handle(process.env)

    const pool = new Pool({
      host: db.host,
      port: db.port,
      database: db.database,
      user: db.user,
      password: db.password,
    })

    return drizzle(pool, { schema: { users } })
  }
}

export default CreateDrizzleService
