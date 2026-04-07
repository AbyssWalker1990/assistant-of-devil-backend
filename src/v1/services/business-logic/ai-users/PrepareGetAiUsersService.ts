import { Request } from 'express'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { aiUsers, AiUser } from '../../../models/AiUser'

class PrepareGetAiUsersService {
  public async handle(_req: Request): Promise<{ aiUsers: Omit<AiUser, 'passPhrase'>[] }> {
    const db = new CreateDrizzleService().handle()
    const result = await db
      .select({ id: aiUsers.id, name: aiUsers.name, createdAt: aiUsers.createdAt, updatedAt: aiUsers.updatedAt })
      .from(aiUsers)
    return { aiUsers: result }
  }
}

export default PrepareGetAiUsersService
