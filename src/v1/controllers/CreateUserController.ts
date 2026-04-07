import { NextFunction, Request, Response } from 'express'

import PrepareCreateUserService from '../services/business-logic/users/PrepareCreateUserService'

class CreateUserController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareCreateUserService().handle(req)
      res.status(201).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default CreateUserController
