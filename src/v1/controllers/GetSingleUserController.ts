import { NextFunction, Request, Response } from 'express'

import PrepareGetSingleUserService from '../services/business-logic/users/PrepareGetSingleUserService'

class GetSingleUserController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareGetSingleUserService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetSingleUserController
