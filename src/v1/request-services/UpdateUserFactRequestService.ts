import { Request } from 'express'

import UpdateUserFactRequestDto, { updateUserFactRequestSchema } from '../dtos/UpdateUserFactRequestDto'

class UpdateUserFactRequestService {
  public handle(req: Request): UpdateUserFactRequestDto {
    return updateUserFactRequestSchema.parse({ ...req.params, ...req.body })
  }
}

export default UpdateUserFactRequestService
