import { NextFunction, Request, Response } from 'express'

import PrepareGetSingleAiUserService from '../../services/business-logic/ai-users/PrepareGetSingleAiUserService'

class GetSingleAiUserController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareGetSingleAiUserService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetSingleAiUserController
