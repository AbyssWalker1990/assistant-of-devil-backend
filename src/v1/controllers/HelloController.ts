import { NextFunction, Request, Response } from 'express'

class HelloController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.send('Hello World!')
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default HelloController
