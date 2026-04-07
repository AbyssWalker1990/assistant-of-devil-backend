import { NextFunction, Request, Response } from 'express'

import SendMessageToAssistantService from '../services/business-logic/assistant/SendMessageToAssistantService'
import SendChatMessageRequestService from '../request-services/SendChatMessageRequestService'

class SendChatMessageController {
  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new SendChatMessageRequestService().handle(req)
      const result = await new SendMessageToAssistantService().handle(
        dto.message,
        dto.previousResponseId,
        dto.aiUserId,
      )
      res.status(200).json({
        response: result.text,
        responseId: result.responseId,
        ...(result.aiUserId !== undefined && { aiUserId: result.aiUserId }),
        ...(result.aiUserName !== undefined && { aiUserName: result.aiUserName }),
        ...(result.isNewUser !== undefined && { isNewUser: result.isNewUser }),
        ...(result.facts !== undefined && { facts: result.facts }),
      })
    } catch (e: unknown) {
      next(e)
    }
  }
}

export default SendChatMessageController
