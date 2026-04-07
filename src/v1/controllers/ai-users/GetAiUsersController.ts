import { NextFunction, Request, Response } from 'express'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { aiUsers } from '../../models/AiUser'

class GetAiUsersController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const db = new CreateDrizzleService().handle()
      const result = await db.select().from(aiUsers)
      res.status(200).json({ aiUsers: result })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetAiUsersController
