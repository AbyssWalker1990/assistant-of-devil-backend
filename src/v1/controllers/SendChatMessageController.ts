import { NextFunction, Request, Response } from 'express'

import PrepareSendChatMessageService from '../services/business-logic/assistant/PrepareSendChatMessageService'

class SendChatMessageController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new PrepareSendChatMessageService().handle(req)
      res.status(200).json(result)
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default SendChatMessageController
