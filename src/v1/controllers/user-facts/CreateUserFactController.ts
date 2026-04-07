import { NextFunction, Request, Response } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { aiUsers } from '../../models/AiUser'
import { userFacts } from '../../models/UserFact'
import CreateUserFactRequestService from '../../request-services/CreateUserFactRequestService'
import AiUserNotFoundException from '../../exceptions/AiUserNotFoundException'

class CreateUserFactController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, content, moralScore } = new CreateUserFactRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const parentUser = await db.query.aiUsers.findFirst({ where: eq(aiUsers.id, userId) })
      if (!parentUser) throw new AiUserNotFoundException()
      const [newFact] = await db.insert(userFacts).values({ aiUserId: userId, content, moralScore }).returning()
      res.status(201).json({ fact: newFact })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default CreateUserFactController
