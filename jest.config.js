module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    collectCoverage: false,
    coverageDirectory: 'coverage',
    coverageReporters: ['text'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.spec.tsx'],
    testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.spec.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    globals: {
        'ts-jest': {
            diagnostics: false,
            tsConfig: {
                esModuleInterop: true,
            },
        },
    },
};
