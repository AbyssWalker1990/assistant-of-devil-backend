import { Request } from 'express'
import { eq } from 'drizzle-orm'

import db from '../../../config/db'
import { userFacts, UserFact } from '../../../models/UserFact'
import GetUserFactsRequestService from '../../../request-services/GetUserFactsRequestService'

class PrepareGetUserFactsService {
  public async handle(req: Request): Promise<{ facts: UserFact[] }> {
    const dto = new GetUserFactsRequestService().handle(req)
    const result = await db.select().from(userFacts).where(eq(userFacts.aiUserId, dto.userId))
    return { facts: result }
  }
}

export default PrepareGetUserFactsService
