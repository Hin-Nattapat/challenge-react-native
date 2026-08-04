import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserList'>;
}

const UserListScreen = (props: IProps) => {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <Text>Team directory</Text>
      <Button
        accessibilityLabel="Open detail"
        title="Open detail"
        onPress={() => navigation.navigate('UserDetail', { userId: 1 })}
      />
      <Button
        accessibilityLabel="Open add teammate"
        title="Open add teammate"
        onPress={() => navigation.navigate('AddTeammate')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
});

export default UserListScreen;
