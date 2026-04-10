import bcrypt from 'bcrypt'
import { eq, sql } from 'drizzle-orm'

import db from '../../../config/db'
import { aiUsers, AiUser } from '../../../models/AiUser'
import { userFacts, UserFact } from '../../../models/UserFact'

const SALT_ROUNDS = 12

export interface IdentifyUserResult {
  aiUser: AiUser
  facts: UserFact[]
  isNewUser: boolean
}

class IdentifyUserService {
  public async handle(name: string, passPhrase: string): Promise<IdentifyUserResult> {
    const candidates = await db
      .select()
      .from(aiUsers)
      .where(sql`LOWER(${aiUsers.name}) = LOWER(${name})`)

    for (const candidate of candidates) {
      const match = await bcrypt.compare(passPhrase, candidate.passPhrase)
      if (match) {
        const facts = await db.select().from(userFacts).where(eq(userFacts.aiUserId, candidate.id))
        return { aiUser: candidate, facts, isNewUser: false }
      }
    }

    const hashedPassPhrase = await bcrypt.hash(passPhrase, SALT_ROUNDS)
    const [newUser] = await db.insert(aiUsers).values({ name, passPhrase: hashedPassPhrase }).returning()
    return { aiUser: newUser, facts: [], isNewUser: true }
  }
}

export default IdentifyUserService
