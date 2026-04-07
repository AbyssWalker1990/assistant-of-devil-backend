import { NextFunction, Request, Response } from 'express'

import PrepareGetUserFactsService from '../../services/business-logic/user-facts/PrepareGetUserFactsService'

class GetUserFactsController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareGetUserFactsService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetUserFactsController
