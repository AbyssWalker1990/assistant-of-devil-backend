import { StatusCodes } from 'http-status-codes'

import ResponseErrorMessageType from '../types/ResponseErrorMessageType'

abstract class AbstractHttpResponseError {
    constructor(public readonly status: StatusCodes, public readonly message: ResponseErrorMessageType) {}
}

export default AbstractHttpResponseError
