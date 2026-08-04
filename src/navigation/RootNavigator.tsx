import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTeammateScreen from '../screens/AddTeammateScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserListScreen from '../screens/UserListScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="UserList">
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={{ title: 'Team directory' }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{ title: 'Teammate' }}
      />
      <Stack.Screen
        name="AddTeammate"
        component={AddTeammateScreen}
        options={{ title: 'Add teammate' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
