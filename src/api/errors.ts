const AUTH_STATUSES = [401, 403];

export interface ApiError extends Error {
  status: number;
}

export const createApiError = (message: string, status: number): ApiError =>
  Object.assign(new Error(message), { name: 'ApiError', status });

// Structural check, so nothing depends on constructor identity across bundlers.
export const isApiError = (error: unknown): error is ApiError =>
  error instanceof Error &&
  typeof (error as Partial<ApiError>).status === 'number';

// ReqRes started requiring an API key after this challenge was written, so an
// unset REQRES_API_KEY is the likeliest auth failure — not the network.
export const AUTH_ERROR_MESSAGE =
  'The ReqRes API key is missing or invalid. Set REQRES_API_KEY in .env, then restart Metro with a cleared cache — see the README.';

export const NETWORK_ERROR_MESSAGE = 'Check your connection and try again.';

export const isAuthError = (error: unknown): boolean =>
  isApiError(error) && AUTH_STATUSES.includes(error.status);

// Full-screen states offer a recovery hint rather than the server's wording.
export const getErrorMessage = (error: unknown): string =>
  isAuthError(error) ? AUTH_ERROR_MESSAGE : NETWORK_ERROR_MESSAGE;

// The form has room to repeat what the API actually said.
export const getApiMessage = (error: unknown, fallback: string): string => {
  if (isAuthError(error)) {
    return AUTH_ERROR_MESSAGE;
  }

  return error instanceof Error ? error.message : fallback;
};
