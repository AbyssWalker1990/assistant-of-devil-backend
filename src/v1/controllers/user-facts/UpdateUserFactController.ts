import { NextFunction, Request, Response } from 'express'

import PrepareUpdateUserFactService from '../../services/business-logic/user-facts/PrepareUpdateUserFactService'

class UpdateUserFactController {
  async put(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareUpdateUserFactService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default UpdateUserFactController
