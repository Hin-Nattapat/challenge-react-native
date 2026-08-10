import { env } from '../config/env';
import { createApiError } from './errors';

export enum HttpMethod {
  Post = 'POST',
}

interface IRequestOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
}

interface IErrorResponse {
  error?: unknown;
}

export const apiRequest = async <TResponse, TBody = never>(
  endpoint: string,
  options: IRequestOptions<TBody> = {},
): Promise<TResponse> => {
  const { body, method } = options;
  const headers: Record<string, string> = {
    'x-api-key': env.reqresApiKey,
  };
  const request: RequestInit = { headers };

  if (method) request.method = method;
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    request.body = JSON.stringify(body);
  }

  const response = await fetch(`${env.apiBaseUrl}${endpoint}`, request);

  // A gateway can answer with HTML or an empty body; parsing must not throw first.
  let responseBody: unknown;
  let isBodyReadable = true;

  try {
    responseBody = await response.json();
  } catch {
    isBodyReadable = false;
  }

  if (!response.ok) {
    const error = isBodyReadable
      ? (responseBody as IErrorResponse).error
      : undefined;

    throw createApiError(
      typeof error === 'string'
        ? error
        : `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (!isBodyReadable) {
    throw createApiError(
      'Received an unreadable response from the server',
      response.status,
    );
  }

  return responseBody as TResponse;
};
