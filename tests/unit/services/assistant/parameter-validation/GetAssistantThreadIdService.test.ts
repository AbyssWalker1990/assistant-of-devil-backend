import { describe, expect, test } from '@jest/globals'
import { Request } from 'express'

import AssistantThreadIdInvalidError from '../../../../../src/v1/errors/parameter-validation/AssistantThreadIdInvalidError'
import GetAssistantThreadIdService from '../../../../../src/v1/services/assistant/parameter-validation/GetAssistantThreadIdService'

describe('GetAssistantThreadIdService', () => {
    const dataSetValue = (params: unknown): { req: Request; expectedValue: unknown } => {
        const req = { body: { assistantThreadId: params } } as unknown as Request
        return { req, expectedValue: params }
    }

    const getAssistantThreadIdService = new GetAssistantThreadIdService()

    describe('handle', () => {
        describe('it should throw an AssistantThreadIdInvalidError', () => {
            const dataSetBadValue = [
                dataSetValue(true),
                dataSetValue([]),
                dataSetValue(1.5),
                dataSetValue(Infinity),
                dataSetValue(Symbol('bad')),
                dataSetValue({}),
                dataSetValue('🆘'),
            ]

            test.each(dataSetBadValue)('for an invalid Assistant ID in request', ({ req }) => {
                expect(() => getAssistantThreadIdService.handle(req)).toThrow(AssistantThreadIdInvalidError)
            })
        })

        describe('it should return', () => {
            const dataSetProperValue = [
                dataSetValue('sd09g8sd09hg0fhs09ds1'),
                dataSetValue('sd09g8sd09hg0fhs09ds2'),
                dataSetValue('sd09g8sd09hg0fhs09ds3'),
                dataSetValue('sd09g8sd09hg0fhs09ds4'),
                dataSetValue('sd09g8sd09hg0fhs09ds5'),
            ]

            test.each(dataSetProperValue)('a valid id as string', ({ req, expectedValue }) => {
                expect(getAssistantThreadIdService.handle(req)).toEqual(expectedValue)
            })
        })
    })
})
