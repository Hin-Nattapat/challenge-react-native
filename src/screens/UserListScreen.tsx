import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import OmiseBadge from '../components/OmiseBadge';
import UserRow from '../components/UserRow';
import { useThemeColors } from '../hooks/theme';
import { useUsers } from '../hooks/users';
import type { RootStackParamList } from '../navigation/types';
import type { User } from '../types/user';

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserList'>;
}

const UserListScreen = (props: IProps) => {
  const { navigation } = props;
  const { data, isError, isPending, refetch } = useUsers();
  const colors = useThemeColors();
  const users = data?.data ?? [];

  const openUser = useCallback(
    (user: User) => {
      navigation.navigate('UserDetail', { userId: user.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<User>) => (
      <UserRow onPress={openUser} user={item} />
    ),
    [openUser],
  );

  if (isPending) {
    return <LoadingState label="Loading teammates" />;
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={() => refetch()}
        retryAccessibilityLabel="Retry loading teammates"
        title="Could not load teammates"
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={[
        styles.listContent,
        users.length === 0 && styles.emptyListContent,
      ]}
      data={users}
      keyExtractor={user => String(user.id)}
      ListEmptyComponent={
        <View accessibilityLiveRegion="polite" style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No teammates found
          </Text>
          <Text style={[styles.emptyMessage, { color: colors.secondaryText }]}>
            The directory is empty right now.
          </Text>
        </View>
      }
      ListFooterComponent={<OmiseBadge />}
      ListHeaderComponent={
        users.length > 0 ? (
          <View style={styles.listHeader}>
            <Text
              accessibilityRole="header"
              style={[styles.heading, { color: colors.text }]}
            >
              People
            </Text>
            <Text style={[styles.count, { color: colors.secondaryText }]}>
              {users.length} teammates
            </Text>
          </View>
        ) : null
      }
      renderItem={renderItem}
      style={{ backgroundColor: colors.background }}
      testID="user-list"
    />
  );
};

const styles = StyleSheet.create({
  count: {
    fontSize: 15,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  listContent: {
    paddingBottom: 24,
  },
  listHeader: {
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});

export default UserListScreen;
