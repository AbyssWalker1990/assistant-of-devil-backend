import { describe, expect, test } from '@jest/globals'
import { Request } from 'express'

import AssistantQuestionInvalidError from '../../../../../src/v1/errors/parameter-validation/AssistantQuestionInvalidError'
import GetAssistantQuestionService from '../../../../../src/v1/services/assistant/parameter-validation/GetAssistantQuestionService'

describe('GetAssistantQuestionService', () => {
    const dataSetValue = (body: unknown): { req: Request, expectedValue: string } => {
        const req = { body } as unknown as Request
        return { req, expectedValue: req.body.question }
    }

    const getAssistantQuestionService = new GetAssistantQuestionService()

    describe('handle', () => {
        describe('it should return', () => {
            const dataSetProperValue = [
                dataSetValue({ question: 'Valid question' }),
                dataSetValue({ question: 'Another Valid question' }),
                dataSetValue({ question: '76' }),
                dataSetValue({ question: 'A'.repeat(2000) }),
            ]

            test.each(dataSetProperValue)(' a valid assistant question as string', ({ req, expectedValue }) => {
                expect(getAssistantQuestionService.handle(req)).toEqual(expectedValue)
            })
        })

        describe('it should throw GetAssistantQuestionService', () => {
            const dataSetBadValue = [
                dataSetValue({ question: '' }),
                dataSetValue({ question: 'A' }),
                dataSetValue({ question: 'A'.repeat(2001) }),
                dataSetValue({}),
                dataSetValue({ question: [] }),
                dataSetValue({ question: Infinity }),
                dataSetValue({ question: null }),
                dataSetValue({ question: undefined }),
                dataSetValue({ question: true }),
                dataSetValue({ question: BigInt(123) }),
                dataSetValue({ question: '🎃🎃🎃' }),
                dataSetValue({ question: 239420 }),
                dataSetValue({ question: 3.14159 }),
                dataSetValue({ question: new Date() }),
                dataSetValue({ question: new Map() }),
                dataSetValue({ question: new Set() }),
                dataSetValue({ question: Symbol('bad') }),
            ]

            test.each(dataSetBadValue)(' for invalid assistant question', ({ req }) => {
                expect(() => getAssistantQuestionService.handle(req)).toThrow(AssistantQuestionInvalidError)
            })
        })
    })
})
