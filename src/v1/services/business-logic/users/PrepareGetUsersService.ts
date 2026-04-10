import { Request } from 'express'

import db from '../../../config/db'
import { users, User } from '../../../models/User'

class PrepareGetUsersService {
  public async handle(_req: Request): Promise<{ users: User[] }> {
    const result = await db.select().from(users)
    return { users: result }
  }
}

export default PrepareGetUsersService
