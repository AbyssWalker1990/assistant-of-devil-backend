import { Request } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { aiUsers } from '../../../models/AiUser'
import { userFacts, UserFact } from '../../../models/UserFact'
import CreateUserFactRequestService from '../../../request-services/CreateUserFactRequestService'
import AiUserNotFoundException from '../../../exceptions/AiUserNotFoundException'

class PrepareCreateUserFactService {
  public async handle(req: Request): Promise<{ fact: UserFact }> {
    const { userId, content, moralScore } = new CreateUserFactRequestService().handle(req)
    const db = new CreateDrizzleService().handle()
    const parentUser = await db.query.aiUsers.findFirst({ where: eq(aiUsers.id, userId) })
    if (!parentUser) throw new AiUserNotFoundException()
    const [newFact] = await db.insert(userFacts).values({ aiUserId: userId, content, moralScore }).returning()
    return { fact: newFact }
  }
}

export default PrepareCreateUserFactService
