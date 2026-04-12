import { NextFunction, Request, Response } from 'express'

import PrepareAuthAiUserService from '../../services/business-logic/ai-users/PrepareAuthAiUserService'

class AuthAiUserController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareAuthAiUserService().handle(req)
      res.status(result.isNewUser ? 201 : 200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default AuthAiUserController
