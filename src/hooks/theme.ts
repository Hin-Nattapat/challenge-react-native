import { useColorScheme } from 'react-native';
import { AppearanceMode, darkColors, lightColors } from '../theme/colors';

export type ThemeColors = typeof lightColors;

export const useIsDarkMode = () => useColorScheme() === AppearanceMode.Dark;

export const useThemeColors = (): ThemeColors =>
  useIsDarkMode() ? darkColors : lightColors;
