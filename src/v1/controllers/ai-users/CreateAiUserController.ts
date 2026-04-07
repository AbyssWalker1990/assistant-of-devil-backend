import { NextFunction, Request, Response } from 'express'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { aiUsers } from '../../models/AiUser'
import CreateAiUserRequestService from '../../request-services/CreateAiUserRequestService'

class CreateAiUserController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateAiUserRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const [newAiUser] = await db.insert(aiUsers).values(dto).returning()
      res.status(201).json({ aiUser: newAiUser })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default CreateAiUserController
