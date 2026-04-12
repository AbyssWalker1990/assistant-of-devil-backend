import bcrypt from 'bcrypt'
import { eq, sql } from 'drizzle-orm'

import db from '../../../config/db'
import { aiUsers, AiUser, userFacts, UserFact } from '../../../../../database/schema'

const SALT_ROUNDS = 12
const MAX_RETRIES = 3

export interface IdentifyUserResult {
  aiUser: AiUser
  facts: UserFact[]
  isNewUser: boolean
}

class IdentifyUserService {
  public async handle(name: string, passPhrase: string): Promise<IdentifyUserResult> {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await this.identifyWithinTransaction(name, passPhrase)
      } catch (error: unknown) {
        const isSerializationFailure = error instanceof Error && 'code' in error && error.code === '40001'
        if (!isSerializationFailure || attempt === MAX_RETRIES - 1) throw error
      }
    }

    throw new Error('Unreachable: exhausted retries without returning or throwing')
  }

  private async identifyWithinTransaction(name: string, passPhrase: string): Promise<IdentifyUserResult> {
    return db.transaction(
      async (tx) => {
        const candidates = await tx
          .select()
          .from(aiUsers)
          .where(sql`LOWER(${aiUsers.name}) = LOWER(${name})`)

        for (const candidate of candidates) {
          const match = await bcrypt.compare(passPhrase, candidate.passPhrase)
          if (match) {
            const facts = await tx.select().from(userFacts).where(eq(userFacts.aiUserId, candidate.id))
            return { aiUser: candidate, facts, isNewUser: false }
          }
        }

        const hashedPassPhrase = await bcrypt.hash(passPhrase, SALT_ROUNDS)
        const [newUser] = await tx.insert(aiUsers).values({ name, passPhrase: hashedPassPhrase }).returning()
        return { aiUser: newUser, facts: [], isNewUser: true }
      },
      { isolationLevel: 'serializable' },
    )
  }
}

export default IdentifyUserService
