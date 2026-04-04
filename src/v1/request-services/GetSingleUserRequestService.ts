import { Request } from 'express'

import GetSingleUserRequestDto, { getSingleUserRequestSchema } from '../dtos/GetSingleUserRequestDto'

class GetSingleUserRequestService {
  public handle(req: Request): GetSingleUserRequestDto {
    return getSingleUserRequestSchema.parse(req.params)
  }
}

export default GetSingleUserRequestService
