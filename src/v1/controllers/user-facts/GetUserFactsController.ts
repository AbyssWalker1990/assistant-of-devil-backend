import { NextFunction, Request, Response } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { userFacts } from '../../models/UserFact'
import GetUserFactsRequestService from '../../request-services/GetUserFactsRequestService'

class GetUserFactsController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new GetUserFactsRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const result = await db.select().from(userFacts).where(eq(userFacts.aiUserId, dto.userId))
      res.status(200).json({ facts: result })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetUserFactsController
