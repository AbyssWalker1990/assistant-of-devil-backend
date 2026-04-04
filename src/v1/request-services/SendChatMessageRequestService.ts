import { Request } from 'express'

import SendChatMessageRequestDto, { sendChatMessageRequestSchema } from '../dtos/SendChatMessageRequestDto'

class SendChatMessageRequestService {
  public handle(req: Request): SendChatMessageRequestDto {
    return sendChatMessageRequestSchema.parse(req.body)
  }
}

export default SendChatMessageRequestService
