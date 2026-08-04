import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { useIsDarkMode } from './src/hooks/theme';
import RootNavigator from './src/navigation/RootNavigator';
import QueryProvider from './src/providers/QueryProvider';

const App = () => {
  const isDarkMode = useIsDarkMode();

  return (
    <QueryProvider>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <RootNavigator />
      </NavigationContainer>
    </QueryProvider>
  );
};

export default App;
