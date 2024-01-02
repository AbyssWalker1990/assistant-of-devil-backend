import { describe, expect, test } from '@jest/globals'
import { Request } from 'express'

import AskAssistantRequestServiceDtoMapper from '../../../src/v1/mappers/AskAssistantRequestServiceDtoMapper'
import AssistantThreadIdType from '../../../src/v1/types/assistant/AssistantThreadIdType'
import AskAssistantRequestServiceDto from '../../../src/v1/dtos/AskAssistantRequestServiceDto'

describe('AskAssistantRequestServiceDtoMapper', () => {
    const req = {} as Request
    const assistantThreadId: AssistantThreadIdType = '64e8bfd21c7c8e1a4d575e78'
    const question = 'How are you?'
    const reqBody = { assistantThreadId, question }
    const mapped: AskAssistantRequestServiceDto = { assistantThreadId, question, req }

    const askAssistantRequestServiceDtoMapper = new AskAssistantRequestServiceDtoMapper()

    describe('map', () => {
        test('returns mapped object AskAssistantRequestServiceDto', () => {
            expect(askAssistantRequestServiceDtoMapper.map(reqBody, req)).toStrictEqual(mapped)
        })
    })
})
