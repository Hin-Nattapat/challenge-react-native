import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../hooks/theme';

interface IProps {
  firstName: string;
  lastName: string;
  size: number;
  uri: string;
}

const Avatar = (props: IProps) => {
  const { firstName, lastName, size, uri } = props;
  const [hasImageFailed, setHasImageFailed] = useState(false);
  const colors = useThemeColors();
  const shape = { borderRadius: size / 2, height: size, width: size };

  if (hasImageFailed) {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.fallback, shape, { backgroundColor: colors.pressed }]}
      >
        <Text
          style={[
            styles.initials,
            { color: colors.secondaryText, fontSize: size * 0.36 },
          ]}
        >
          {initials.toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <Image
      accessibilityIgnoresInvertColors
      accessible={false}
      onError={() => setHasImageFailed(true)}
      source={{ uri }}
      style={shape}
      testID="avatar-image"
    />
  );
};

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '600',
  },
});

export default Avatar;
