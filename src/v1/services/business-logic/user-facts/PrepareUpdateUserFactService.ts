import { Request } from 'express'
import { and, eq } from 'drizzle-orm'

import db from '../../../config/db'
import { userFacts, UserFact } from '../../../../../database/schema'
import UpdateUserFactRequestService from '../../../request-services/UpdateUserFactRequestService'
import UserFactNotFoundException from '../../../exceptions/UserFactNotFoundException'

class PrepareUpdateUserFactService {
  public async handle(req: Request): Promise<{ fact: UserFact }> {
    const { id, userId, ...fields } = new UpdateUserFactRequestService().handle(req)
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
