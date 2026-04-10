import { Request } from 'express'

import db from '../../../config/db'
import { users, User } from '../../../models/User'
import CreateUserRequestService from '../../../request-services/CreateUserRequestService'

class PrepareCreateUserService {
  public async handle(req: Request): Promise<{ user: User }> {
    const dto = new CreateUserRequestService().handle(req)
    const [newUser] = await db.insert(users).values(dto).returning()
    return { user: newUser }
  }
}

export default PrepareCreateUserService
