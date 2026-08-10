import { Image, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../hooks/theme';

// The wordmark is white with a mint accent, so it ships on its own dark surface.
const OmiseBadge = () => {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel="Omise"
        accessibilityRole="image"
        source={require('../assets/omise-badge.png')}
        style={styles.badge}
      />
      <Text style={[styles.caption, { color: colors.secondaryText }]}>
        React Native take-home challenge
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    height: 48,
    width: 144,
  },
  caption: {
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
  },
});

export default OmiseBadge;
