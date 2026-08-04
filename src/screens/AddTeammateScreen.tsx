import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { useCreateUser } from '../hooks/users';
import { AppearanceMode, darkColors, lightColors } from '../theme/colors';

interface IValidationErrors {
  job?: string;
  name?: string;
}

const AddTeammateScreen = () => {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [validationErrors, setValidationErrors] = useState<IValidationErrors>(
    {},
  );
  const { error, isError, isPending, isSuccess, mutate } = useCreateUser();
  const isDarkMode = useColorScheme() === AppearanceMode.Dark;
  const colors = isDarkMode ? darkColors : lightColors;

  const submit = () => {
    const trimmedName = name.trim();
    const trimmedJob = job.trim();
    const nextErrors: IValidationErrors = {};

    if (!trimmedName) {
      nextErrors.name = 'Name is required';
    }

    if (!trimmedJob) {
      nextErrors.job = 'Job is required';
    }

    setValidationErrors(nextErrors);

    if (nextErrors.name || nextErrors.job) {
      return;
    }

    mutate(
      { name: trimmedName, job: trimmedJob },
      {
        onSuccess: () => {
          setName('');
          setJob('');
        },
      },
    );
  };

  const errorMessage =
    error instanceof Error ? error.message : 'Could not create teammate';

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding' })}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          accessibilityRole="header"
          style={[styles.heading, { color: colors.text }]}
        >
          New teammate
        </Text>
        <Text style={[styles.intro, { color: colors.secondaryText }]}>
          Add their role so the directory stays useful for everyone.
        </Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Name</Text>
          <TextInput
            accessibilityLabel="Name"
            accessibilityState={{ disabled: isPending }}
            autoCapitalize="words"
            editable={!isPending}
            onChangeText={setName}
            placeholder="Jane Doe"
            placeholderTextColor={colors.secondaryText}
            returnKeyType="next"
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: validationErrors.name
                  ? colors.error
                  : colors.separator,
                color: colors.text,
              },
            ]}
            value={name}
          />
          {validationErrors.name ? (
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.validation, { color: colors.error }]}
            >
              {validationErrors.name}
            </Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Job</Text>
          <TextInput
            accessibilityLabel="Job"
            accessibilityState={{ disabled: isPending }}
            autoCapitalize="words"
            editable={!isPending}
            onChangeText={setJob}
            onSubmitEditing={submit}
            placeholder="Software engineer"
            placeholderTextColor={colors.secondaryText}
            returnKeyType="done"
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: validationErrors.job
                  ? colors.error
                  : colors.separator,
                color: colors.text,
              },
            ]}
            value={job}
          />
          {validationErrors.job ? (
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.validation, { color: colors.error }]}
            >
              {validationErrors.job}
            </Text>
          ) : null}
        </View>

        {isError ? (
          <Text
            accessibilityLiveRegion="assertive"
            accessibilityRole="alert"
            style={[styles.feedback, { color: colors.error }]}
          >
            {errorMessage}
          </Text>
        ) : null}
        {isSuccess ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.feedback, { color: colors.accent }]}
          >
            Teammate created
          </Text>
        ) : null}

        <Pressable
          accessibilityLabel={
            isPending ? 'Creating teammate' : 'Create teammate'
          }
          accessibilityRole="button"
          accessibilityState={{ disabled: isPending }}
          disabled={isPending}
          onPress={submit}
          style={({ pressed }) => [
            styles.submit,
            {
              backgroundColor: colors.accent,
              opacity: pressed || isPending ? 0.72 : 1,
            },
          ]}
        >
          {isPending ? (
            <ActivityIndicator color={colors.onAccent} />
          ) : (
            <Text style={[styles.submitLabel, { color: colors.onAccent }]}>
              Create teammate
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  feedback: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 20,
    textAlign: 'center',
  },
  field: {
    marginTop: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
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
  intro: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  screen: {
    flex: 1,
  },
  submit: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 52,
    paddingHorizontal: 20,
  },
  submitLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  validation: {
    fontSize: 14,
    marginTop: 6,
  },
});

export default AddTeammateScreen;
