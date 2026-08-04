import { API_BASE_URL, REQRES_API_KEY } from './envSource';

export const getRequiredEnv = (
  name: string,
  value: string | undefined,
): string => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return trimmedValue;
};

export const env = {
  apiBaseUrl: getRequiredEnv('API_BASE_URL', API_BASE_URL),
  reqresApiKey: getRequiredEnv('REQRES_API_KEY', REQRES_API_KEY),
};
