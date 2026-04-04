import { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

import ResponseErrorCodeEnum from '../enums/ResponseErrorCodeEnum'
import AbstractHttpResponseError from '../exceptions/AbstractHttpResponseError'

class ErrorMiddleware {
  /* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
  public run(error: AbstractHttpResponseError | unknown, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof AbstractHttpResponseError) {
      const { status, message } = error
      res.status(Number(status)).send(message)
    } else if (error instanceof ZodError) {
      res.status(StatusCodes.BAD_REQUEST).send({
        code: ResponseErrorCodeEnum.VALIDATION_ERROR,
        reason: ReasonPhrases.BAD_REQUEST,
        errors: error.issues,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        code: ResponseErrorCodeEnum.UNKNOWN,
        reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
      })
    }
  }
}

export default ErrorMiddleware
