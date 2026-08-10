import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemeColors } from '../hooks/theme';
import type { RootStackParamList } from '../navigation/types';

const AddTeammateButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const colors = useThemeColors();

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
