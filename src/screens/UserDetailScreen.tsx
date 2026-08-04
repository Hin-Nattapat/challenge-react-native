import type { RouteProp } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Avatar from '../components/Avatar';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { useThemeColors } from '../hooks/theme';
import { useUser } from '../hooks/users';
import type { RootStackParamList } from '../navigation/types';

const AVATAR_SIZE = 120;

interface IProps {
  route: RouteProp<RootStackParamList, 'UserDetail'>;
}

const UserDetailScreen = (props: IProps) => {
  const { route } = props;
  const { data, isError, isPending, refetch } = useUser(route.params.userId);
  const colors = useThemeColors();

  if (isPending) {
    return <LoadingState label="Loading teammate" />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        onRetry={() => refetch()}
        retryAccessibilityLabel="Retry loading teammate"
        title="Could not load teammate"
      />
    );
  }

  const {
    avatar,
    email,
    first_name: firstName,
    last_name: lastName,
  } = data.data;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: colors.background }}
    >
      <Avatar
        firstName={firstName}
        lastName={lastName}
        size={AVATAR_SIZE}
        uri={avatar}
      />
      <Text
        accessibilityLabel={`${firstName} ${lastName}`}
        accessibilityRole="header"
        style={[styles.name, { color: colors.text }]}
      >
        {firstName} {lastName}
      </Text>
      <Text selectable style={[styles.email, { color: colors.secondaryText }]}>
        {email}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  email: {
    fontSize: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 24,
    textAlign: 'center',
  },
});

export default UserDetailScreen;
