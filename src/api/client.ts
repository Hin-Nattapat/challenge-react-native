import { env } from '../config/env';

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

  // A gateway can answer with HTML or an empty body. Parsing must not throw
  // before the status has been turned into a message the screens can show.
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

    throw new Error(
      typeof error === 'string'
        ? error
        : `Request failed with status ${response.status}`,
    );
  }

  if (!isBodyReadable) {
    throw new Error('Received an unreadable response from the server');
  }

  return responseBody as TResponse;
};
