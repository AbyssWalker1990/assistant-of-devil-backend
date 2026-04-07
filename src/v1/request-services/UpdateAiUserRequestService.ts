import { Request } from 'express'

import UpdateAiUserRequestDto, { updateAiUserRequestSchema } from '../dtos/UpdateAiUserRequestDto'

class UpdateAiUserRequestService {
  public handle(req: Request): UpdateAiUserRequestDto {
    return updateAiUserRequestSchema.parse({ ...req.params, ...req.body })
  }
}

export default UpdateAiUserRequestService
