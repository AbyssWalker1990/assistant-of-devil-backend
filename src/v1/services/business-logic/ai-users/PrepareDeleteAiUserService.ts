import { Request } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { aiUsers } from '../../../models/AiUser'
import AiUserParamsRequestService from '../../../request-services/AiUserParamsRequestService'
import AiUserNotFoundException from '../../../exceptions/AiUserNotFoundException'

class PrepareDeleteAiUserService {
  public async handle(req: Request): Promise<void> {
    const dto = new AiUserParamsRequestService().handle(req)
    const db = new CreateDrizzleService().handle()
    const [deleted] = await db.delete(aiUsers).where(eq(aiUsers.id, dto.id)).returning({ id: aiUsers.id })
    if (!deleted) throw new AiUserNotFoundException()
  }
}

export default PrepareDeleteAiUserService
