import { NextFunction, Request, Response } from 'express'

import PrepareGetSingleUserFactService from '../../services/business-logic/user-facts/PrepareGetSingleUserFactService'

class GetSingleUserFactController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareGetSingleUserFactService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetSingleUserFactController
