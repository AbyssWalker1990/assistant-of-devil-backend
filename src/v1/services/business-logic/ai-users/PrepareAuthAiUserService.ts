import bcrypt from 'bcrypt'
import { Request } from 'express'
import { eq, sql } from 'drizzle-orm'

import db from '../../../config/db'
import { AiUser, aiUsers, UserFact, userFacts } from '../../../../../database/schema'
import AuthAiUserRequestService from '../../../request-services/AuthAiUserRequestService'
import InvalidPassPhraseException from '../../../exceptions/InvalidPassPhraseException'

const SALT_ROUNDS = 12
const MAX_RETRIES = 3

interface AuthAiUserResult {
  aiUser: Omit<AiUser, 'passPhrase'>
  facts: UserFact[]
  isNewUser: boolean
}

class PrepareAuthAiUserService {
  public async handle(req: Request): Promise<AuthAiUserResult> {
    const dto = new AuthAiUserRequestService().handle(req)

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await this.authWithinTransaction(dto.name, dto.passPhrase)
      } catch (error: unknown) {
        const isSerializationFailure = error instanceof Error && 'code' in error && error.code === '40001'
        if (!isSerializationFailure || attempt === MAX_RETRIES - 1) throw error
      }
    }

    throw new Error('Unreachable: exhausted retries without returning or throwing')
  }

  private async authWithinTransaction(name: string, passPhrase: string): Promise<AuthAiUserResult> {
    return db.transaction(
      async (tx) => {
        const candidates = await tx
          .select()
          .from(aiUsers)
          .where(sql`LOWER(${aiUsers.name}) = LOWER(${name})`)

        if (candidates.length > 0) {
          for (const candidate of candidates) {
            const match = await bcrypt.compare(passPhrase, candidate.passPhrase)
            if (match) {
              const facts = await tx.select().from(userFacts).where(eq(userFacts.aiUserId, candidate.id))
              const { passPhrase: _, ...aiUser } = candidate
              return { aiUser, facts, isNewUser: false }
            }
          }
          throw new InvalidPassPhraseException()
        }

        const hashedPassPhrase = await bcrypt.hash(passPhrase, SALT_ROUNDS)
        const [newUser] = await tx
          .insert(aiUsers)
          .values({ name, passPhrase: hashedPassPhrase })
          .returning({ id: aiUsers.id, name: aiUsers.name, createdAt: aiUsers.createdAt, updatedAt: aiUsers.updatedAt })
        return { aiUser: newUser, facts: [], isNewUser: true }
      },
      { isolationLevel: 'serializable' },
    )
  }
}

export default PrepareAuthAiUserService
