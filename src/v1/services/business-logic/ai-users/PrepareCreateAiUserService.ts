import bcrypt from 'bcrypt'
import { Request } from 'express'

import db from '../../../config/db'
import { aiUsers, AiUser } from '../../../models/AiUser'
import CreateAiUserRequestService from '../../../request-services/CreateAiUserRequestService'

const SALT_ROUNDS = 12

class PrepareCreateAiUserService {
  public async handle(req: Request): Promise<{ aiUser: Omit<AiUser, 'passPhrase'> }> {
    const dto = new CreateAiUserRequestService().handle(req)
    const hashedPassPhrase = await bcrypt.hash(dto.passPhrase, SALT_ROUNDS)
    const [newAiUser] = await db
      .insert(aiUsers)
      .values({ ...dto, passPhrase: hashedPassPhrase })
      .returning({ id: aiUsers.id, name: aiUsers.name, createdAt: aiUsers.createdAt, updatedAt: aiUsers.updatedAt })
    return { aiUser: newAiUser }
  }
}

export default PrepareCreateAiUserService
