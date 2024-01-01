import { describe, expect, test } from '@jest/globals'
import { Sequelize } from 'sequelize'

import EnvVariableNotFoundError from '../../../src/v1/errors/inner/EnvVariableNotFoundError'
import CreateSequelizeService from '../../../src/v1/config/CreateSequelizeService'
import GetEnvVariablesService from '../../../src/v1/config/GetEnvVariablesService'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mockImplementations from '../utils/mockImplementations'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import returnValue from '../utils/mockReturnValue'

describe('CreateSequelizeService', () => {
    const db = {
        host: 'host',
        port: 1234,
        database: 'database',
        username: 'username',
        password: 'password',
    }
    const parseEnvResult = {
        db,
    }

    const getEnvVariablesService = new GetEnvVariablesService()
    const createSequelizeService = new CreateSequelizeService(getEnvVariablesService)

    describe('handle', () => {
        test('Throw EnvVariableNotFoundError if getEnvVariablesService fails', () => {
            getEnvVariablesService.handle = mockImplementations(() => {
                throw new EnvVariableNotFoundError()
            })

            expect(() => createSequelizeService.handle()).toThrow(EnvVariableNotFoundError)

            expect(jest.spyOn(getEnvVariablesService, 'handle')).toBeCalled()
        })

        test('return Sequelize object', () => {
            getEnvVariablesService.handle = returnValue(parseEnvResult)

            expect(createSequelizeService.handle()).toBeInstanceOf(Sequelize)

            expect(jest.spyOn(getEnvVariablesService, 'handle')).toBeCalled()
        })
    })
})
