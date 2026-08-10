import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../hooks/theme';

interface IProps {
  missingVars: string[];
}

const ConfigError = (props: IProps) => {
  const { missingVars } = props;
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const names = missingVars.join(' and ');
  const verb = missingVars.length === 1 ? 'is' : 'are';

  return (
    <View
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom + 32,
          paddingTop: insets.top + 32,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Configuration needed
      </Text>
      <Text style={[styles.message, { color: colors.secondaryText }]}>
        {names} {verb} not set. Copy .env.example to .env, add your ReqRes API
        key, then restart Metro with a cleared cache — see the README.
      </Text>
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
    marginTop: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ConfigError;
