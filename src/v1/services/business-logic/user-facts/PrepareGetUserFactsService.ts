import { Request } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { userFacts, UserFact } from '../../../models/UserFact'
import GetUserFactsRequestService from '../../../request-services/GetUserFactsRequestService'

class PrepareGetUserFactsService {
  public async handle(req: Request): Promise<{ facts: UserFact[] }> {
    const dto = new GetUserFactsRequestService().handle(req)
    const db = new CreateDrizzleService().handle()
    const result = await db.select().from(userFacts).where(eq(userFacts.aiUserId, dto.userId))
    return { facts: result }
  }
}

export default PrepareGetUserFactsService
