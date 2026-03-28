import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/', 'src/v1/services/business-logic/assistant/test.ts'],
    maxWorkers: '50%',
    collectCoverage: true,
    collectCoverageFrom: ['./src/v1/(services|mappers|config)/**/*.ts'],
    coveragePathIgnorePatterns: [],
    restoreMocks: true,
}

export default config
