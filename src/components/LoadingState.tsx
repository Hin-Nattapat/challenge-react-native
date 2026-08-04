import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../hooks/theme';

interface IProps {
  label: string;
}

const LoadingState = (props: IProps) => {
  const { label } = props;
  const colors = useThemeColors();

  return (
    <View
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator color={colors.accent} size="large" />
      <Text style={[styles.title, { color: colors.text }]}>{label}</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoadingState;
