import {
  AUTH_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  createApiError,
  getApiMessage,
  getErrorMessage,
  isApiError,
  isAuthError,
} from '../../src/api/errors';

describe('createApiError', () => {
  test('stays a real Error so existing instanceof checks keep working', () => {
    const error = createApiError('Forbidden', 403);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Forbidden');
    expect(error.name).toBe('ApiError');
    expect(error.status).toBe(403);
  });
});

describe('isApiError', () => {
  test('accepts an error carrying a status', () => {
    expect(isApiError(createApiError('Nope', 500))).toBe(true);
  });

  test.each([new Error('plain'), { status: 403 }, undefined, null, 'oops'])(
    'rejects %p',
    value => {
      expect(isApiError(value)).toBe(false);
    },
  );
});

describe('isAuthError', () => {
  test.each([401, 403])('treats %p as an auth failure', status => {
    expect(isAuthError(createApiError('Denied', status))).toBe(true);
  });

  test.each([400, 404, 500])('treats %p as an ordinary failure', status => {
    expect(isAuthError(createApiError('Broken', status))).toBe(false);
  });

  test('rejects an error with no status', () => {
    expect(isAuthError(new Error('Network request failed'))).toBe(false);
  });
});

describe('getErrorMessage', () => {
  test('points at the API key for an auth failure', () => {
    expect(getErrorMessage(createApiError('missing_api_key', 401))).toBe(
      AUTH_ERROR_MESSAGE,
    );
  });

  test('falls back to the connection hint otherwise', () => {
    expect(getErrorMessage(new Error('Network request failed'))).toBe(
      NETWORK_ERROR_MESSAGE,
    );
  });
});

describe('getApiMessage', () => {
  test('replaces an auth failure with the actionable hint', () => {
    expect(
      getApiMessage(createApiError('missing_api_key', 403), 'fallback'),
    ).toBe(AUTH_ERROR_MESSAGE);
  });

  test('repeats what the API said for any other failure', () => {
    expect(
      getApiMessage(createApiError('Name is too long', 422), 'fallback'),
    ).toBe('Name is too long');
  });

  test('uses the fallback when the rejection is not an Error', () => {
    expect(getApiMessage('something odd', 'fallback')).toBe('fallback');
  });
});
