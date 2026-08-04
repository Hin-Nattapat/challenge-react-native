import type { RouteProp } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

interface IProps {
  route: RouteProp<RootStackParamList, 'UserDetail'>;
}

const UserDetailScreen = (props: IProps) => {
  const { route } = props;

  return (
    <View style={styles.container}>
      <Text>User detail: {route.params.userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});

export default UserDetailScreen;
