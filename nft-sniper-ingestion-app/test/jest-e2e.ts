import type { Config } from 'jest';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const env = dotenv.config({
  path: '.env.test',
});

dotenvExpand.expand(env);

if (env.error) {
  throw env.error;
}

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
