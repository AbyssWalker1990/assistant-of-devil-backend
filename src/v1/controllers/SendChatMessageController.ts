import { NextFunction, Request, Response } from 'express'

import SendMessageToAssistantService from '../services/business-logic/assistant/SendMessageToAssistantService'
import SendChatMessageRequestService from '../request-services/SendChatMessageRequestService'

class SendChatMessageController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new SendChatMessageRequestService().handle(req)
      const service = new SendMessageToAssistantService()
      const result = await service.handle(dto.message, dto.previousResponseId)
      res.status(200).json({ response: result.text, responseId: result.responseId })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default SendChatMessageController
