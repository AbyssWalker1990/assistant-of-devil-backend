import { StatusCodes } from 'http-status-codes'

import ResponseErrorCodeEnum from '../enums/ResponseErrorCodeEnum'
import AbstractHttpResponseError from './AbstractHttpResponseError'

class AiUserNotFoundException extends AbstractHttpResponseError {
  constructor() {
    super(StatusCodes.NOT_FOUND, {
      code: ResponseErrorCodeEnum.AI_USER_NOT_FOUND,
      reason: 'AI User not found',
    })
  }
}

export default AiUserNotFoundException
