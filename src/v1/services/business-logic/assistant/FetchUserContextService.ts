import { eq } from 'drizzle-orm'

import db from '../../../config/db'
import { aiUsers, AiUser, userFacts, UserFact } from '../../../../../database/schema'

export interface UserContext {
  aiUser: AiUser | undefined
  facts: UserFact[]
}

class FetchUserContextService {
  public async handle(aiUserId: number): Promise<UserContext> {
    const aiUser = await db.query.aiUsers.findFirst({ where: eq(aiUsers.id, aiUserId) })
    const facts = aiUser
      ? await db.select().from(userFacts).where(eq(userFacts.aiUserId, aiUserId))
      : []
    return { aiUser, facts }
  }
}

export default FetchUserContextService
