import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '../hooks/theme';

interface IProps {
  disabled?: boolean;
  error?: string;
  label: string;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
  placeholder: string;
  returnKeyType?: TextInputProps['returnKeyType'];
  value: string;
}

const FormField = (props: IProps) => {
  const {
    disabled = false,
    error,
    label,
    onChangeText,
    onSubmitEditing,
    placeholder,
    returnKeyType,
    value,
  } = props;
  const colors = useThemeColors();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        autoCapitalize="words"
        editable={!disabled}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        returnKeyType={returnKeyType}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.separator,
            color: colors.text,
          },
        ]}
        value={value}
      />
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.validation, { color: colors.error }]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginTop: 24,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 17,
    marginTop: 8,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  validation: {
    fontSize: 14,
    marginTop: 6,
  },
});

export default FormField;
