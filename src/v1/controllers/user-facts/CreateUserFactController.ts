import { NextFunction, Request, Response } from 'express'

import PrepareCreateUserFactService from '../../services/business-logic/user-facts/PrepareCreateUserFactService'

class CreateUserFactController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareCreateUserFactService().handle(req)
      res.status(201).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default CreateUserFactController
