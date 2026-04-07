import { NextFunction, Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { userFacts } from '../../models/UserFact'
import UserFactParamsRequestService from '../../request-services/UserFactParamsRequestService'
import UserFactNotFoundException from '../../exceptions/UserFactNotFoundException'

class GetSingleUserFactController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new UserFactParamsRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const [result] = await db
        .select()
        .from(userFacts)
        .where(and(eq(userFacts.id, dto.id), eq(userFacts.aiUserId, dto.userId)))
      if (!result) throw new UserFactNotFoundException()
      res.status(200).json({ fact: result })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetSingleUserFactController
