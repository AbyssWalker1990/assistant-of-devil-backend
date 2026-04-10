import { Request } from 'express'
import { eq } from 'drizzle-orm'

import db from '../../../config/db'
import { users, User } from '../../../models/User'
import GetSingleUserRequestService from '../../../request-services/GetSingleUserRequestService'

class PrepareGetSingleUserService {
  public async handle(req: Request): Promise<{ user: User | undefined }> {
    const dto = new GetSingleUserRequestService().handle(req)
    const result = await db.query.users.findFirst({ where: eq(users.id, dto.id) })
    return { user: result }
  }
}

export default PrepareGetSingleUserService
