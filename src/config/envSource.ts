// react-native-dotenv only rewrites imports: `export ... from '@env'` leaves an
// unresolvable require(), and re-exporting the bindings trips the plugin too.
import {
  API_BASE_URL as apiBaseUrl,
  REQRES_API_KEY as reqresApiKey,
} from '@env';

export const API_BASE_URL = apiBaseUrl;
export const REQRES_API_KEY = reqresApiKey;
