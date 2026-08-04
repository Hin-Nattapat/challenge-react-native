import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useUsers } from '../hooks/users';
import type { RootStackParamList } from '../navigation/types';
import { AppearanceMode, darkColors, lightColors } from '../theme/colors';
import type { User } from '../types/user';

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserList'>;
}

const UserListScreen = (props: IProps) => {
  const { navigation } = props;
  const { data, isError, isPending, refetch } = useUsers();
  const isDarkMode = useColorScheme() === AppearanceMode.Dark;
  const colors = isDarkMode ? darkColors : lightColors;
  const users = data?.data ?? [];

  if (isPending) {
    return (
      <View
        accessibilityLabel="Loading teammates"
        accessibilityLiveRegion="polite"
        accessibilityRole="progressbar"
        style={[styles.stateContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={[styles.stateTitle, { color: colors.text }]}>
          Loading teammates
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        accessibilityLiveRegion="assertive"
        accessibilityRole="alert"
        style={[styles.stateContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.stateTitle, { color: colors.text }]}>
          Could not load teammates
        </Text>
        <Text style={[styles.stateMessage, { color: colors.secondaryText }]}>
          Check your connection and try again.
        </Text>
        <Pressable
          accessibilityLabel="Retry loading teammates"
          accessibilityRole="button"
          onPress={() => refetch()}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: colors.accent, opacity: pressed ? 0.72 : 1 },
          ]}
        >
          <Text style={[styles.retryLabel, { color: colors.onAccent }]}>
            Try again
          </Text>
        </Pressable>
      </View>
    );
  }

  const openUser = (user: User) => {
    navigation.navigate('UserDetail', { userId: user.id });
  };

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
          <Text style={[styles.stateTitle, { color: colors.text }]}>
            No teammates found
          </Text>
          <Text style={[styles.stateMessage, { color: colors.secondaryText }]}>
            The directory is empty right now.
          </Text>
        </View>
      }
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
      renderItem={({ item }) => (
        <Pressable
          accessibilityLabel={`${item.first_name} ${item.last_name}, ${item.email}`}
          accessibilityRole="button"
          onPress={() => openUser(item)}
          style={({ pressed }) => [
            styles.row,
            {
              backgroundColor: pressed ? colors.pressed : colors.background,
              borderBottomColor: colors.separator,
            },
          ]}
        >
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: item.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userText}>
            <Text
              numberOfLines={1}
              style={[styles.name, { color: colors.text }]}
            >
              {item.first_name} {item.last_name}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.email, { color: colors.secondaryText }]}
            >
              {item.email}
            </Text>
          </View>
        </Pressable>
      )}
      style={{ backgroundColor: colors.background }}
      testID="user-list"
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
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
  email: {
    fontSize: 15,
    marginTop: 4,
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
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  retryButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 48,
    minWidth: 136,
    paddingHorizontal: 20,
  },
  retryLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 88,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  stateContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  stateMessage: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    textAlign: 'center',
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  userText: {
    flex: 1,
    marginLeft: 16,
  },
});

export default UserListScreen;
