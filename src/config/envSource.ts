// react-native-dotenv only rewrites `import` declarations, so `export ... from
// '@env'` leaves a require() that Metro cannot resolve. Re-exporting the imported
// bindings directly also trips the plugin, hence the copy through locals.
import {
  API_BASE_URL as apiBaseUrl,
  REQRES_API_KEY as reqresApiKey,
} from '@env';

export const API_BASE_URL = apiBaseUrl;
export const REQRES_API_KEY = reqresApiKey;
