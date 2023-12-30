import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
    },
    maxWorkers: '50%',
    collectCoverage: true,
    collectCoverageFrom: ['./src/v1/(services|mappers)/**/*.ts'],
    coveragePathIgnorePatterns: ['src/v1/services/ParseEnvVariablesService.ts'],
    restoreMocks: true,
}

export default config
