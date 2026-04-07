import { Request } from 'express'
import { and, eq } from 'drizzle-orm'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { userFacts, UserFact } from '../../../models/UserFact'
import UserFactParamsRequestService from '../../../request-services/UserFactParamsRequestService'
import UserFactNotFoundException from '../../../exceptions/UserFactNotFoundException'

class PrepareGetSingleUserFactService {
  public async handle(req: Request): Promise<{ fact: UserFact }> {
    const dto = new UserFactParamsRequestService().handle(req)
    const db = new CreateDrizzleService().handle()
    const [result] = await db
      .select()
      .from(userFacts)
      .where(and(eq(userFacts.id, dto.id), eq(userFacts.aiUserId, dto.userId)))
    if (!result) throw new UserFactNotFoundException()
    return { fact: result }
  }
}

export default PrepareGetSingleUserFactService
