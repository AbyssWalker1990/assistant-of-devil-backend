import { NextFunction, Request, Response } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../config/CreateDrizzleService'
import { aiUsers } from '../../models/AiUser'
import UpdateAiUserRequestService from '../../request-services/UpdateAiUserRequestService'
import AiUserNotFoundException from '../../exceptions/AiUserNotFoundException'

class UpdateAiUserController {
  async put(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, ...fields } = new UpdateAiUserRequestService().handle(req)
      const db = new CreateDrizzleService().handle()
      const [updated] = await db
        .update(aiUsers)
        .set({ ...fields, updatedAt: new Date() })
        .where(eq(aiUsers.id, id))
        .returning()
      if (!updated) throw new AiUserNotFoundException()
      res.status(200).json({ aiUser: updated })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default UpdateAiUserController
