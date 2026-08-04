import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import QueryProvider from './src/providers/QueryProvider';
import { AppearanceMode } from './src/theme/colors';

const App = () => {
  const isDarkMode = useColorScheme() === AppearanceMode.Dark;

  return (
    <QueryProvider>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <RootNavigator />
      </NavigationContainer>
    </QueryProvider>
  );
};

export default App;
