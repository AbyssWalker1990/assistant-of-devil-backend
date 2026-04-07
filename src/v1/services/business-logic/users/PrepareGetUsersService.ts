import { Request } from 'express'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { users, User } from '../../../models/User'

class PrepareGetUsersService {
  public async handle(_req: Request): Promise<{ users: User[] }> {
    const db = new CreateDrizzleService().handle()
    const result = await db.select().from(users)
    return { users: result }
  }
}

export default PrepareGetUsersService
