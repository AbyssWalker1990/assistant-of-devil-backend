import { NextFunction, Request, Response } from 'express'

import PrepareCreateAiUserService from '../../services/business-logic/ai-users/PrepareCreateAiUserService'

class CreateAiUserController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareCreateAiUserService().handle(req)
      res.status(201).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default CreateAiUserController
