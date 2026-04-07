import { NextFunction, Request, Response } from 'express'

import PrepareGetUsersService from '../services/business-logic/users/PrepareGetUsersService'

class GetUsersController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareGetUsersService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default GetUsersController
