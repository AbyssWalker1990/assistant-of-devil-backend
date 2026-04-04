import { Request } from 'express'

import CreateUserRequestDto, { createUserRequestSchema } from '../dtos/CreateUserRequestDto'

class CreateUserRequestService {
  public handle(req: Request): CreateUserRequestDto {
    return createUserRequestSchema.parse(req.body)
  }
}

export default CreateUserRequestService
