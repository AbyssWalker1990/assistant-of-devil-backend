import { Request } from 'express'
import { and, eq } from 'drizzle-orm'

import db from '../../../config/db'
import { userFacts } from '../../../models/UserFact'
import UserFactParamsRequestService from '../../../request-services/UserFactParamsRequestService'
import UserFactNotFoundException from '../../../exceptions/UserFactNotFoundException'

class PrepareDeleteUserFactService {
  public async handle(req: Request): Promise<void> {
    const dto = new UserFactParamsRequestService().handle(req)
    const [deleted] = await db
      .delete(userFacts)
      .where(and(eq(userFacts.id, dto.id), eq(userFacts.aiUserId, dto.userId)))
      .returning({ id: userFacts.id })
    if (!deleted) throw new UserFactNotFoundException()
  }
}

export default PrepareDeleteUserFactService
