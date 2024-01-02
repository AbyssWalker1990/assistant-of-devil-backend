import { describe, expect, test } from '@jest/globals'
import { Request } from 'express'

import AssistantThreadIdInvalidError from '../../../../src/v1/errors/parameter-validation/AssistantThreadIdInvalidError'
import AssistantQuestionInvalidError from '../../../../src/v1/errors/parameter-validation/AssistantQuestionInvalidError'
import AskAssistantRequestServiceDtoMapper from '../../../../src/v1/mappers/AskAssistantRequestServiceDtoMapper'
import AskAssistantRequestService from '../../../../src/v1/services/assistant/AskAssistantRequestService'
import GetAssistantThreadIdService from '../../../../src/v1/services/assistant/parameter-validation/GetAssistantThreadIdService'
import GetAssistantQuestionService from '../../../../src/v1/services/assistant/parameter-validation/GetAssistantQuestionService'
import AssistantThreadIdType from '../../../../src/v1/types/assistant/AssistantThreadIdType'
import AskAssistantRequestServiceDto from '../../../../src/v1/dtos/AskAssistantRequestServiceDto'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mockImplementations from '../../utils/mockImplementations'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import returnValue from '../../utils/mockReturnValue'

describe('AskAssistantRequestService', () => {
    const emptyRequest = {} as unknown as Request
    const assistantThreadId: AssistantThreadIdType = '507f191e810c19729de860ea'
    const question = 'How do I get started?'
    const mapperArgs = { assistantThreadId, question }
    const mappedValue: AskAssistantRequestServiceDto = { assistantThreadId, question, req: emptyRequest }

    const getAssistantThreadIdService = new GetAssistantThreadIdService()
    const getAssistantQuestionService = new GetAssistantQuestionService()
    const askAssistantRequestServiceDtoMapper = new AskAssistantRequestServiceDtoMapper()
    const askAssistantRequestService = new AskAssistantRequestService(
        getAssistantThreadIdService,
        getAssistantQuestionService,
        askAssistantRequestServiceDtoMapper,
    )

    describe('handle', () => {
        test('it should throw AssistantThreadIdInvalidError', async () => {
            getAssistantThreadIdService.handle = mockImplementations(() => {
                throw new AssistantThreadIdInvalidError()
            })
            getAssistantQuestionService.handle = returnValue(question)
            askAssistantRequestServiceDtoMapper.map = returnValue(mappedValue)

            await expect(askAssistantRequestService.handle(emptyRequest)).rejects.toBeInstanceOf(
                AssistantThreadIdInvalidError,
            )

            expect(jest.spyOn(getAssistantThreadIdService, 'handle')).toBeCalledWith(emptyRequest)
            expect(jest.spyOn(getAssistantQuestionService, 'handle')).toBeCalledTimes(0)
            expect(jest.spyOn(askAssistantRequestServiceDtoMapper, 'map')).toBeCalledTimes(0)
        })

        test('it should throw AssistantQuestionInvalidError', async () => {
            getAssistantThreadIdService.handle = returnValue(assistantThreadId)
            getAssistantQuestionService.handle = mockImplementations(() => {
                throw new AssistantQuestionInvalidError()
            })
            askAssistantRequestServiceDtoMapper.map = returnValue(mappedValue)

            await expect(askAssistantRequestService.handle(emptyRequest)).rejects.toBeInstanceOf(
                AssistantQuestionInvalidError,
            )

            expect(jest.spyOn(getAssistantThreadIdService, 'handle')).toBeCalledWith(emptyRequest)
            expect(jest.spyOn(getAssistantQuestionService, 'handle')).toBeCalledWith(emptyRequest)
            expect(jest.spyOn(askAssistantRequestServiceDtoMapper, 'map')).toBeCalledTimes(0)
        })

        test('it should return AskAssistantRequestServiceDto', async () => {
            getAssistantThreadIdService.handle = returnValue(assistantThreadId)
            getAssistantQuestionService.handle = returnValue(question)
            askAssistantRequestServiceDtoMapper.map = returnValue(mappedValue)

            await expect(askAssistantRequestService.handle(emptyRequest)).resolves.toStrictEqual(mappedValue)

            expect(jest.spyOn(getAssistantThreadIdService, 'handle')).toBeCalledWith(emptyRequest)
            expect(jest.spyOn(getAssistantQuestionService, 'handle')).toBeCalledWith(emptyRequest)
            expect(jest.spyOn(askAssistantRequestServiceDtoMapper, 'map')).toBeCalledWith(mapperArgs, emptyRequest)
        })
    })
})
