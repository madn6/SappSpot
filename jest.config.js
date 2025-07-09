/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.test.json' // or just 'tsconfig.json' if you don’t need separate config
			}
		]
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	testMatch: ['**/tests/**/*.test.ts'],
};
