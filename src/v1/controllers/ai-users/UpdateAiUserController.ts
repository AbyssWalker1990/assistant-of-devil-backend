import { NextFunction, Request, Response } from 'express'

import PrepareUpdateAiUserService from '../../services/business-logic/ai-users/PrepareUpdateAiUserService'

class UpdateAiUserController {
  async put(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareUpdateAiUserService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default UpdateAiUserController
