import { Request } from 'express'

import { UserFact } from '../../../../../database/schema'
import SendChatMessageRequestService from '../../../request-services/SendChatMessageRequestService'
import SendMessageToAssistantService from './SendMessageToAssistantService'

interface SendChatMessageResponse {
  response: string
  responseId: string
  aiUserId?: number
  aiUserName?: string
  isNewUser?: boolean
  facts?: UserFact[]
}

class PrepareSendChatMessageService {
  public async handle(req: Request): Promise<SendChatMessageResponse> {
    const dto = new SendChatMessageRequestService().handle(req)
    const result = await new SendMessageToAssistantService().handle(dto.message, dto.previousResponseId, dto.aiUserId)
    return {
      response: result.text,
      responseId: result.responseId,
      ...(result.aiUserId !== undefined && { aiUserId: result.aiUserId }),
      ...(result.aiUserName !== undefined && { aiUserName: result.aiUserName }),
      ...(result.isNewUser !== undefined && { isNewUser: result.isNewUser }),
      ...(result.facts !== undefined && { facts: result.facts }),
    }
  }
}

export default PrepareSendChatMessageService
