import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../hooks/theme';

interface IProps {
  message: string;
  onRetry: () => void;
  retryAccessibilityLabel: string;
  title: string;
}

const ErrorState = (props: IProps) => {
  const { message, onRetry, retryAccessibilityLabel, title } = props;
  const colors = useThemeColors();

  return (
    <View
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.secondaryText }]}>
        {message}
      </Text>
      <Pressable
        accessibilityLabel={retryAccessibilityLabel}
        accessibilityRole="button"
        onPress={onRetry}
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
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ErrorState;
