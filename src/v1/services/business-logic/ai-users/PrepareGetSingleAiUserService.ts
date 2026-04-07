import { Request } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { aiUsers, AiUser } from '../../../models/AiUser'
import AiUserParamsRequestService from '../../../request-services/AiUserParamsRequestService'
import AiUserNotFoundException from '../../../exceptions/AiUserNotFoundException'

class PrepareGetSingleAiUserService {
  public async handle(req: Request): Promise<{ aiUser: Omit<AiUser, 'passPhrase'> }> {
    const dto = new AiUserParamsRequestService().handle(req)
    const db = new CreateDrizzleService().handle()
    const [result] = await db
      .select({ id: aiUsers.id, name: aiUsers.name, createdAt: aiUsers.createdAt, updatedAt: aiUsers.updatedAt })
      .from(aiUsers)
      .where(eq(aiUsers.id, dto.id))
      .limit(1)
    if (!result) throw new AiUserNotFoundException()
    return { aiUser: result }
  }
}

export default PrepareGetSingleAiUserService
