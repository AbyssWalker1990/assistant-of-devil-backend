import { Request } from 'express'
import { and, eq } from 'drizzle-orm'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { userFacts, UserFact } from '../../../models/UserFact'
import UpdateUserFactRequestService from '../../../request-services/UpdateUserFactRequestService'
import UserFactNotFoundException from '../../../exceptions/UserFactNotFoundException'

class PrepareUpdateUserFactService {
  public async handle(req: Request): Promise<{ fact: UserFact }> {
    const { id, userId, ...fields } = new UpdateUserFactRequestService().handle(req)
    const db = new CreateDrizzleService().handle()
    const [updated] = await db
      .update(userFacts)
      .set({ ...fields, updatedAt: new Date() })
      .where(and(eq(userFacts.id, id), eq(userFacts.aiUserId, userId)))
      .returning()
    if (!updated) throw new UserFactNotFoundException()
    return { fact: updated }
  }
}

export default PrepareUpdateUserFactService
