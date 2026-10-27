import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getErrorMessage } from '../api/errors';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import OmiseBadge from '../components/OmiseBadge';
import Toast from '../components/Toast';
import UserRow from '../components/UserRow';
import { useThemeColors } from '../hooks/theme';
import { useUsers } from '../hooks/users';
import type { RootStackParamList } from '../navigation/types';
import type { User } from '../types/user';

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserList'>;
  route: RouteProp<RootStackParamList, 'UserList'>;
}

const UserListScreen = (props: IProps) => {
  const { navigation, route } = props;
  const { data, error, isError, isPending, refetch } = useUsers();
  const [toastMessage, setToastMessage] = useState<string>();
  const createdTeammateName = route.params?.createdTeammateName;
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const users = data?.data ?? [];

  const openUser = useCallback(
    (user: User) => {
      navigation.navigate('UserDetail', { userId: user.id });
    },
    [navigation],
  );

  // Consume the param so adding someone with the same name toasts again.
  useEffect(() => {
    if (createdTeammateName) {
      setToastMessage(`${createdTeammateName} added to the team`);
      navigation.setParams({ createdTeammateName: undefined });
    }
  }, [createdTeammateName, navigation]);

  const hideToast = useCallback(() => setToastMessage(undefined), []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<User>) => (
      <UserRow onPress={openUser} user={item} />
    ),
    [openUser],
  );

  const renderContent = () => {
    if (isPending) {
      return <LoadingState label="Loading teammates" />;
    }

    if (isError) {
      return (
        <ErrorState
          message={getErrorMessage(error)}
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
          { paddingBottom: insets.bottom + 24 },
        ]}
        data={users}
        keyExtractor={user => String(user.id)}
        ListEmptyComponent={
          <View accessibilityLiveRegion="polite" style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No teammates found
            </Text>
            <Text
              style={[styles.emptyMessage, { color: colors.secondaryText }]}
            >
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

  return (
    <View style={styles.screen}>
      {renderContent()}
      {toastMessage && <Toast message={toastMessage} onHide={hideToast} />}
    </View>
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
  screen: {
    flex: 1,
  },
});

export default UserListScreen;
