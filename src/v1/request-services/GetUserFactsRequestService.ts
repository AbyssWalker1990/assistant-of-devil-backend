import { Request } from 'express'

import GetUserFactsParamsDto, { getUserFactsParamsSchema } from '../dtos/GetUserFactsParamsDto'

class GetUserFactsRequestService {
  public handle(req: Request): GetUserFactsParamsDto {
    return getUserFactsParamsSchema.parse(req.params)
  }
}

export default GetUserFactsRequestService
