import { Request } from 'express'

import AuthAiUserRequestDto, { authAiUserRequestSchema } from '../dtos/AuthAiUserRequestDto'

class AuthAiUserRequestService {
  public handle(req: Request): AuthAiUserRequestDto {
    return authAiUserRequestSchema.parse(req.body)
  }
}

export default AuthAiUserRequestService
