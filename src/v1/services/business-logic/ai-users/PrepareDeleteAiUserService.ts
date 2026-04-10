import { Request } from 'express'
import { eq } from 'drizzle-orm'

import db from '../../../config/db'
import { aiUsers } from '../../../../../database/schema'
import AiUserParamsRequestService from '../../../request-services/AiUserParamsRequestService'
import AiUserNotFoundException from '../../../exceptions/AiUserNotFoundException'

class PrepareDeleteAiUserService {
  public async handle(req: Request): Promise<void> {
    const dto = new AiUserParamsRequestService().handle(req)
    const [deleted] = await db.delete(aiUsers).where(eq(aiUsers.id, dto.id)).returning({ id: aiUsers.id })
    if (!deleted) throw new AiUserNotFoundException()
  }
}

export default PrepareDeleteAiUserService
