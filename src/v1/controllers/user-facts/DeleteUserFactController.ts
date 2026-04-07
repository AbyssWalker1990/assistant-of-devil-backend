import { NextFunction, Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { userFacts } from '../../models/UserFact'
import UserFactParamsRequestService from '../../request-services/UserFactParamsRequestService'
import UserFactNotFoundException from '../../exceptions/UserFactNotFoundException'

class DeleteUserFactController {
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new UserFactParamsRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const [deleted] = await db
        .delete(userFacts)
        .where(and(eq(userFacts.id, dto.id), eq(userFacts.aiUserId, dto.userId)))
        .returning()
      if (!deleted) throw new UserFactNotFoundException()
      res.status(204).send()
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default DeleteUserFactController
