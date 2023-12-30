import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
    },
    maxWorkers: '50%',
    collectCoverage: true,
    collectCoverageFrom: ['./src/v1/(services|mappers|config)/**/*.ts'],
    coveragePathIgnorePatterns: ['src/v1/config/GetEnvVariablesService.ts'],
    restoreMocks: true,
}

export default config
