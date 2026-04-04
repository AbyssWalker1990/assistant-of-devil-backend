import { NextFunction, Request, Response } from 'express'

import CreateDrizzleService from '../config/CreateDrizzleService'
import { users } from '../models/User'
import CreateUserRequestService from '../request-services/CreateUserRequestService'

class CreateUserController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateUserRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const [newUser] = await db.insert(users).values(dto).returning()
      res.status(201).json({ user: newUser })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default CreateUserController
