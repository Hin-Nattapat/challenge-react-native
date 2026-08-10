import { API_BASE_URL, REQRES_API_KEY } from './envSource';

// This module sits on every screen's import path, so throwing here would
// red-screen the app before any UI could explain the fix. Report as data.
const readEnv = (value: string | undefined): string => value?.trim() ?? '';

export const env = {
  apiBaseUrl: readEnv(API_BASE_URL),
  reqresApiKey: readEnv(REQRES_API_KEY),
};

export const missingEnvVars = (
  [
    ['API_BASE_URL', env.apiBaseUrl],
    ['REQRES_API_KEY', env.reqresApiKey],
  ] as const
)
  .filter(([, value]) => !value)
  .map(([name]) => name);
