import { Request } from 'express'

import CreateAiUserRequestDto, { createAiUserRequestSchema } from '../dtos/CreateAiUserRequestDto'

class CreateAiUserRequestService {
  public handle(req: Request): CreateAiUserRequestDto {
    return createAiUserRequestSchema.parse(req.body)
  }
}

export default CreateAiUserRequestService
