import type { RouteProp } from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useUser } from '../hooks/users';
import type { RootStackParamList } from '../navigation/types';
import { AppearanceMode, darkColors, lightColors } from '../theme/colors';

interface IProps {
  route: RouteProp<RootStackParamList, 'UserDetail'>;
}

const UserDetailScreen = (props: IProps) => {
  const { route } = props;
  const { data, isError, isPending, refetch } = useUser(route.params.userId);
  const isDarkMode = useColorScheme() === AppearanceMode.Dark;
  const colors = isDarkMode ? darkColors : lightColors;

  if (isPending) {
    return (
      <View
        accessibilityLabel="Loading teammate"
        accessibilityLiveRegion="polite"
        accessibilityRole="progressbar"
        style={[styles.stateContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={[styles.stateTitle, { color: colors.text }]}>
          Loading teammate
        </Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View
        accessibilityLiveRegion="assertive"
        accessibilityRole="alert"
        style={[styles.stateContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.stateTitle, { color: colors.text }]}>
          Could not load teammate
        </Text>
        <Text style={[styles.stateMessage, { color: colors.secondaryText }]}>
          Check your connection and try again.
        </Text>
        <Pressable
          accessibilityLabel="Retry loading teammate"
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
      <Image
        accessibilityIgnoresInvertColors
        accessible={false}
        source={{ uri: avatar }}
        style={styles.avatar}
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
  avatar: {
    borderRadius: 60,
    height: 120,
    width: 120,
  },
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
});

export default UserDetailScreen;
