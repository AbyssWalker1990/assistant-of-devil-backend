import { Request } from 'express'

import UserFactParamsDto, { userFactParamsSchema } from '../dtos/UserFactParamsDto'

class UserFactParamsRequestService {
  public handle(req: Request): UserFactParamsDto {
    return userFactParamsSchema.parse(req.params)
  }
}

export default UserFactParamsRequestService
