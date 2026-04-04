import { NextFunction, Request, Response } from 'express'

import CreateDrizzleService from '../config/CreateDrizzleService'
import { users } from '../models/User'

class GetUsersController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const db = new CreateDrizzleService().handle()
      const result = await db.select().from(users)
      res.status(200).json({ users: result })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetUsersController
