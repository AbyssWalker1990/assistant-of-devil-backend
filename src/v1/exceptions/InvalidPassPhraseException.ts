import { StatusCodes } from 'http-status-codes'

import ResponseErrorCodeEnum from '../enums/ResponseErrorCodeEnum'
import AbstractHttpResponseError from './AbstractHttpResponseError'

class InvalidPassPhraseException extends AbstractHttpResponseError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, {
      code: ResponseErrorCodeEnum.INVALID_PASS_PHRASE,
      reason: 'Invalid pass phrase for this user',
    })
  }
}

export default InvalidPassPhraseException
