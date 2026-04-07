import bcrypt from 'bcrypt'
import { Request } from 'express'
import { eq } from 'drizzle-orm'

import CreateDrizzleService from '../../../config/CreateDrizzleService'
import { aiUsers, AiUser } from '../../../models/AiUser'
import UpdateAiUserRequestService from '../../../request-services/UpdateAiUserRequestService'
import AiUserNotFoundException from '../../../exceptions/AiUserNotFoundException'

const SALT_ROUNDS = 12

class PrepareUpdateAiUserService {
  public async handle(req: Request): Promise<{ aiUser: Omit<AiUser, 'passPhrase'> }> {
    const { id, passPhrase, ...rest } = new UpdateAiUserRequestService().handle(req)
    const hashedPassPhrase = passPhrase !== undefined ? await bcrypt.hash(passPhrase, SALT_ROUNDS) : undefined
    const db = new CreateDrizzleService().handle()
    const [updated] = await db
      .update(aiUsers)
      .set({ ...rest, ...(hashedPassPhrase !== undefined && { passPhrase: hashedPassPhrase }), updatedAt: new Date() })
      .where(eq(aiUsers.id, id))
      .returning({ id: aiUsers.id, name: aiUsers.name, createdAt: aiUsers.createdAt, updatedAt: aiUsers.updatedAt })
    if (!updated) throw new AiUserNotFoundException()
    return { aiUser: updated }
  }
}

export default PrepareUpdateAiUserService
