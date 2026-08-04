import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { AppearanceMode, darkColors, lightColors } from '../theme/colors';

const AddTeammateButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDarkMode = useColorScheme() === AppearanceMode.Dark;
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <Pressable
      accessibilityLabel="Open add teammate"
      accessibilityRole="button"
      onPress={() => navigation.navigate('AddTeammate')}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={[styles.label, { color: colors.accent }]}>Add</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.55,
  },
});

export default AddTeammateButton;
