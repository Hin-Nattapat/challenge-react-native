import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import QueryProvider from './src/providers/QueryProvider';

const App = () => {
  return (
    <QueryProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryProvider>
  );
};

export default App;
