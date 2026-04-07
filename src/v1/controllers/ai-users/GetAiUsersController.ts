import { NextFunction, Request, Response } from 'express'

import PrepareGetAiUsersService from '../../services/business-logic/ai-users/PrepareGetAiUsersService'

class GetAiUsersController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareGetAiUsersService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetAiUsersController
