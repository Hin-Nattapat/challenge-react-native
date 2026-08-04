jest.mock('../../src/config/envSource', () => ({
  API_BASE_URL: ' https://reqres.in/api ',
  REQRES_API_KEY: ' test-api-key ',
}));

import { env, getRequiredEnv } from '../../src/config/env';

describe('getRequiredEnv', () => {
  test('builds the public environment from raw values', () => {
    expect(env).toEqual({
      apiBaseUrl: 'https://reqres.in/api',
      reqresApiKey: 'test-api-key',
    });
  });

  test('trims a configured value', () => {
    expect(getRequiredEnv('API_BASE_URL', ' https://reqres.in/api ')).toBe(
      'https://reqres.in/api',
    );
  });

  test.each([undefined, '', '   '])('rejects missing value %p', value => {
    expect(() => getRequiredEnv('REQRES_API_KEY', value)).toThrow(
      'Missing environment variable: REQRES_API_KEY',
    );
  });
});
