export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        "^.+\\.tsx?$": "ts-jest" ,
    // process `*.tsx` files with `ts-jest`
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform" 
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__ mocks __/fileMock.js',
    },
}