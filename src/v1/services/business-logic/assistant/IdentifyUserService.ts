import { and, eq, sql } from 'drizzle-orm'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { aiUsers, AiUser } from '../../../models/AiUser'
import { userFacts, UserFact } from '../../../models/UserFact'

export interface IdentifyUserResult {
  aiUser: AiUser
  facts: UserFact[]
  isNewUser: boolean
}

class IdentifyUserService {
  constructor(private readonly createDrizzleService = new CreateDrizzleService()) {}

  public async handle(name: string, passPhrase: string): Promise<IdentifyUserResult> {
    const db = this.createDrizzleService.handle()

    const existingUser = await db.query.aiUsers.findFirst({
      where: and(
        sql`LOWER(${aiUsers.name}) = LOWER(${name})`,
        sql`LOWER(${aiUsers.passPhrase}) = LOWER(${passPhrase})`,
      ),
    })

    if (existingUser) {
      const facts = await db.select().from(userFacts).where(eq(userFacts.aiUserId, existingUser.id))
      return { aiUser: existingUser, facts, isNewUser: false }
    }

    const [newUser] = await db.insert(aiUsers).values({ name, passPhrase }).returning()
    return { aiUser: newUser, facts: [], isNewUser: true }
  }
}

export default IdentifyUserService
