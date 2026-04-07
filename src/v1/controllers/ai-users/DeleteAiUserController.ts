import { NextFunction, Request, Response } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { aiUsers } from '../../models/AiUser'
import AiUserParamsRequestService from '../../request-services/AiUserParamsRequestService'
import AiUserNotFoundException from '../../exceptions/AiUserNotFoundException'

class DeleteAiUserController {
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new AiUserParamsRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const [deleted] = await db.delete(aiUsers).where(eq(aiUsers.id, dto.id)).returning()
      if (!deleted) throw new AiUserNotFoundException()
      res.status(204).send()
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default DeleteAiUserController
