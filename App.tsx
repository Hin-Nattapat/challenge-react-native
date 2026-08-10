import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import ConfigError from './src/components/ConfigError';
import { missingEnvVars } from './src/config/env';
import { useIsDarkMode } from './src/hooks/theme';
import RootNavigator from './src/navigation/RootNavigator';
import QueryProvider from './src/providers/QueryProvider';

const App = () => {
  const isDarkMode = useIsDarkMode();

  return (
    // Real insets on the first frame instead of a blank pass while measuring.
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {/* One message here beats three screens each reporting a request error. */}
      {missingEnvVars.length > 0 ? (
        <ConfigError missingVars={missingEnvVars} />
      ) : (
        <QueryProvider>
          <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <RootNavigator />
          </NavigationContainer>
        </QueryProvider>
      )}
    </SafeAreaProvider>
  );
};

export default App;
