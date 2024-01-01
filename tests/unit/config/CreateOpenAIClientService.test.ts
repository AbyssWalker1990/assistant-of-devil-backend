import { describe, expect, test } from '@jest/globals'
import OpenAI from 'openai'

import EnvVariableNotFoundError from '../../../src/v1/errors/inner/EnvVariableNotFoundError'
import CreateOpenAIClientService from '../../../src/v1/config/CreateOpenAIClientService'
import GetEnvVariablesService from '../../../src/v1/config/GetEnvVariablesService'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mockImplementations from '../utils/mockImplementations'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import returnValue from '../utils/mockReturnValue'

describe('CreateOpenAIClientService', () => {
    const key = 'openai key'
    const parseEnvResult = {
        openai: { key },
    }

    const getEnvVariablesService = new GetEnvVariablesService()
    const createOpenAIClientService = new CreateOpenAIClientService(getEnvVariablesService)

    describe('handle', () => {
        test('Throw EnvVariableNotFoundError if getEnvVariablesService fails', () => {
            getEnvVariablesService.handle = mockImplementations(() => {
                throw new EnvVariableNotFoundError()
            })

            expect(() => createOpenAIClientService.handle()).toThrow(EnvVariableNotFoundError)

            expect(jest.spyOn(getEnvVariablesService, 'handle')).toBeCalled()
        })

        test('return OpenAI object', () => {
            getEnvVariablesService.handle = returnValue(parseEnvResult)

            expect(createOpenAIClientService.handle()).toBeInstanceOf(OpenAI)

            expect(jest.spyOn(getEnvVariablesService, 'handle')).toBeCalled()
        })
    })
})
