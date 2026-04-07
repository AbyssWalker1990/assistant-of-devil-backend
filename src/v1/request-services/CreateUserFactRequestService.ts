import { Request } from 'express'

import CreateUserFactRequestDto, { createUserFactRequestSchema } from '../dtos/CreateUserFactRequestDto'

class CreateUserFactRequestService {
  public handle(req: Request): CreateUserFactRequestDto {
    return createUserFactRequestSchema.parse({ ...req.params, ...req.body })
  }
}

export default CreateUserFactRequestService
