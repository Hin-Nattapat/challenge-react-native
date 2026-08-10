jest.mock('../../src/config/envSource', () => ({
  API_BASE_URL: ' https://reqres.in/api ',
  REQRES_API_KEY: ' test-api-key ',
}));

import { env, missingEnvVars } from '../../src/config/env';

describe('env', () => {
  test('trims the raw values into the public environment', () => {
    expect(env).toEqual({
      apiBaseUrl: 'https://reqres.in/api',
      reqresApiKey: 'test-api-key',
    });
  });

  test('reports nothing missing when both values are set', () => {
    expect(missingEnvVars).toEqual([]);
  });
});

describe('missingEnvVars without configuration', () => {
  test.each([
    [undefined, ['REQRES_API_KEY']],
    ['', ['REQRES_API_KEY']],
    ['   ', ['REQRES_API_KEY']],
  ])('names the unset variable for %p', (rawKey, expected) => {
    jest.resetModules();
    jest.doMock('../../src/config/envSource', () => ({
      API_BASE_URL: 'https://reqres.in/api',
      REQRES_API_KEY: rawKey,
    }));

    expect(require('../../src/config/env').missingEnvVars).toEqual(expected);
  });

  test('names every unset variable', () => {
    jest.resetModules();
    jest.doMock('../../src/config/envSource', () => ({
      API_BASE_URL: undefined,
      REQRES_API_KEY: undefined,
    }));

    expect(require('../../src/config/env').missingEnvVars).toEqual([
      'API_BASE_URL',
      'REQRES_API_KEY',
    ]);
  });

  test('does not throw while being imported', () => {
    jest.resetModules();
    jest.doMock('../../src/config/envSource', () => ({
      API_BASE_URL: undefined,
      REQRES_API_KEY: undefined,
    }));

    expect(() => require('../../src/config/env')).not.toThrow();
  });
});
