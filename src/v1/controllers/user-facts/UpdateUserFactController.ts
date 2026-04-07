import { NextFunction, Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { userFacts } from '../../models/UserFact'
import UpdateUserFactRequestService from '../../request-services/UpdateUserFactRequestService'
import UserFactNotFoundException from '../../exceptions/UserFactNotFoundException'

class UpdateUserFactController {
  async put(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, userId, ...fields } = new UpdateUserFactRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const [updated] = await db
        .update(userFacts)
        .set({ ...fields, updatedAt: new Date() })
        .where(and(eq(userFacts.id, id), eq(userFacts.aiUserId, userId)))
        .returning()
      if (!updated) throw new UserFactNotFoundException()
      res.status(200).json({ fact: updated })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default UpdateUserFactController
