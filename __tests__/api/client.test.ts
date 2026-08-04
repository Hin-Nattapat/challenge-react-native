jest.mock('../../src/config/env', () => ({
  env: {
    apiBaseUrl: 'https://reqres.in/api',
    reqresApiKey: 'test-api-key',
  },
}));

import { apiRequest, HttpMethod } from '../../src/api/client';

const fetchMock = jest.fn();

describe('apiRequest', () => {
  beforeEach(() => {
    globalThis.fetch = fetchMock;
    fetchMock.mockReset();
  });

  test('sends a GET request with the configured API key', async () => {
    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
    });

    await apiRequest('/users?page=1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://reqres.in/api/users?page=1',
      { headers: { 'x-api-key': 'test-api-key' } },
    );
  });

  test('serializes a POST body and adds its content type', async () => {
    const body = { name: 'Jane', job: 'Engineer' };
    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
      ok: true,
    });

    await apiRequest('/users', { method: HttpMethod.Post, body });

    expect(fetchMock).toHaveBeenCalledWith('https://reqres.in/api/users', {
      method: HttpMethod.Post,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'test-api-key',
      },
      body: JSON.stringify(body),
    });
  });

  test('throws the API error message from a failed response', async () => {
    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ error: 'Forbidden' }),
      ok: false,
      status: 403,
    });

    await expect(apiRequest('/users')).rejects.toThrow('Forbidden');
  });

  test('uses the response status when a failed response has no error', async () => {
    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
      ok: false,
      status: 500,
    });

    await expect(apiRequest('/users')).rejects.toThrow(
      'Request failed with status 500',
    );
  });
});
