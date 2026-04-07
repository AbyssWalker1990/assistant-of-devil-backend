import { Request } from 'express'

import AiUserParamsDto, { aiUserParamsSchema } from '../dtos/AiUserParamsDto'

class AiUserParamsRequestService {
  public handle(req: Request): AiUserParamsDto {
    return aiUserParamsSchema.parse(req.params)
  }
}

export default AiUserParamsRequestService
