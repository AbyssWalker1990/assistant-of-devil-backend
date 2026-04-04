import { NextFunction, Request, Response } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../config/CreateDrizzleService'
import { users } from '../models/User'
import GetSingleUserRequestService from '../request-services/GetSingleUserRequestService'

class GetSingleUserController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new GetSingleUserRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const result = await db.query.users.findFirst({
        where: eq(users.id, dto.id),
      })
      res.status(200).json({ user: result })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetSingleUserController
