import { describe, expect, test } from '@jest/globals'

import EnvVariableNotFoundError from '../../../src/v1/errors/inner/EnvVariableNotFoundError'
import CreateDrizzleService from '../../../src/v1/config/CreateDrizzleService'
import GetEnvVariablesService from '../../../src/v1/config/GetEnvVariablesService'
import mockImplementations from '../utils/mockImplementations'
import returnValue from '../utils/mockReturnValue'

describe('CreateDrizzleService', () => {
  const db = {
    host: 'host',
    port: 1234,
    database: 'database',
    user: 'user',
    password: 'password',
  }
  const parseEnvResult = {
    db,
  }

  const getEnvVariablesService = new GetEnvVariablesService()
  const createDrizzleService = new CreateDrizzleService(getEnvVariablesService)

  describe('handle', () => {
    test('Throw EnvVariableNotFoundError if getEnvVariablesService fails', () => {
      getEnvVariablesService.handle = mockImplementations(() => {
        throw new EnvVariableNotFoundError()
      })

      expect(() => createDrizzleService.handle()).toThrow(EnvVariableNotFoundError)

      expect(jest.spyOn(getEnvVariablesService, 'handle')).toBeCalled()
    })

    test('return drizzle db object', () => {
      getEnvVariablesService.handle = returnValue(parseEnvResult)

      const db = createDrizzleService.handle()
      expect(typeof db.select).toBe('function')
      expect(typeof db.insert).toBe('function')

      expect(jest.spyOn(getEnvVariablesService, 'handle')).toBeCalled()
    })
  })
})
