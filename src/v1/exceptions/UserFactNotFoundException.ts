import { StatusCodes } from 'http-status-codes'

import ResponseErrorCodeEnum from '../enums/ResponseErrorCodeEnum'
import AbstractHttpResponseError from './AbstractHttpResponseError'

class UserFactNotFoundException extends AbstractHttpResponseError {
  constructor() {
    super(StatusCodes.NOT_FOUND, {
      code: ResponseErrorCodeEnum.USER_FACT_NOT_FOUND,
      reason: 'User fact not found',
    })
  }
}

export default UserFactNotFoundException
