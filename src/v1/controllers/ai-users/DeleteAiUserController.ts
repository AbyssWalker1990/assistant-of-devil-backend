import { NextFunction, Request, Response } from 'express'

import PrepareDeleteAiUserService from '../../services/business-logic/ai-users/PrepareDeleteAiUserService'

class DeleteAiUserController {
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new PrepareDeleteAiUserService().handle(req)
      res.status(204).send()
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default DeleteAiUserController
