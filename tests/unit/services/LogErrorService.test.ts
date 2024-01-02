import { describe, expect, test } from '@jest/globals'
import { Request } from 'express'

import LogErrorService from '../../../src/v1/services/LogErrorService'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import returnValue from '../utils/mockReturnValue'

describe('LogErrorService', () => {
    const mockRequest: Request = {} as Request
    const errorMessage = 'Something went wrong!'
    const mockError = new Error(errorMessage)

    const logErrorService = new LogErrorService()

    describe('handle', () => {
        test('should log the error', () => {
            console.error = returnValue()

            logErrorService.handle(mockError, mockRequest)

            expect(jest.spyOn(console, 'error')).toBeCalledTimes(4)
        })
    })
})
