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
  const responseBody: unknown = await response.json();

  if (!response.ok) {
    const error = (responseBody as IErrorResponse).error;
    throw new Error(
      typeof error === 'string'
        ? error
        : `Request failed with status ${response.status}`,
    );
  }

  return responseBody as TResponse;
};
