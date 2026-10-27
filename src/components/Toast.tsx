import { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../hooks/theme';

const VISIBLE_MS = 2500;
const FADE_MS = 200;

interface IProps {
  message: string;
  onHide: () => void;
}

const Toast = (props: IProps) => {
  const { message, onHide } = props;
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // accessibilityLiveRegion only reaches TalkBack; VoiceOver needs this.
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message);
    }

    const animation = Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_MS,
        useNativeDriver: true,
      }),
      Animated.delay(VISIBLE_MS),
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => finished && onHide());

    return () => animation.stop();
  }, [message, onHide, opacity]);

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      pointerEvents="none"
      style={[
        styles.toast,
        { backgroundColor: colors.text, bottom: insets.bottom + 24, opacity },
      ]}
    >
      <Text style={[styles.message, { color: colors.background }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  toast: {
    borderRadius: 12,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'absolute',
    right: 20,
  },
});

export default Toast;
