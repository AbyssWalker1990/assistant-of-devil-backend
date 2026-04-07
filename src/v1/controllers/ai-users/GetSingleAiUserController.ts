import { NextFunction, Request, Response } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { aiUsers } from '../../models/AiUser'
import AiUserParamsRequestService from '../../request-services/AiUserParamsRequestService'
import AiUserNotFoundException from '../../exceptions/AiUserNotFoundException'

class GetSingleAiUserController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new AiUserParamsRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const result = await db.query.aiUsers.findFirst({ where: eq(aiUsers.id, dto.id) })
      if (!result) throw new AiUserNotFoundException()
      res.status(200).json({ aiUser: result })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetSingleAiUserController
