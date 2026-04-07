import { NextFunction, Request, Response } from 'express'

import PrepareDeleteUserFactService from '../../services/business-logic/user-facts/PrepareDeleteUserFactService'

class DeleteUserFactController {
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new PrepareDeleteUserFactService().handle(req)
      res.status(204).send()
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default DeleteUserFactController
