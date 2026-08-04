import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import FormField from '../components/FormField';
import { useThemeColors } from '../hooks/theme';
import { useCreateUser } from '../hooks/users';

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
  const { error, isError, isPending, isSuccess, mutate, reset } =
    useCreateUser();
  const colors = useThemeColors();

  const clearValidationError = (field: keyof IValidationErrors) => {
    setValidationErrors(current =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  };

  // Feedback belongs to the submission that produced it, so drop it as soon as
  // the form no longer holds those values.
  const clearMutationFeedback = () => {
    if (isError || isSuccess) {
      reset();
    }
  };

  const changeName = (value: string) => {
    setName(value);
    clearValidationError('name');
    clearMutationFeedback();
  };

  const changeJob = (value: string) => {
    setJob(value);
    clearValidationError('job');
    clearMutationFeedback();
  };

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

        <FormField
          disabled={isPending}
          error={validationErrors.name}
          label="Name"
          onChangeText={changeName}
          placeholder="Jane Doe"
          returnKeyType="next"
          value={name}
        />
        <FormField
          disabled={isPending}
          error={validationErrors.job}
          label="Job"
          onChangeText={changeJob}
          onSubmitEditing={submit}
          placeholder="Software engineer"
          returnKeyType="done"
          value={job}
        />

        {isError && (
          <Text
            accessibilityLiveRegion="assertive"
            accessibilityRole="alert"
            style={[styles.feedback, { color: colors.error }]}
          >
            {errorMessage}
          </Text>
        )}
        {isSuccess && (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.feedback, { color: colors.accent }]}
          >
            Teammate created
          </Text>
        )}

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
  heading: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  intro: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
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
});

export default AddTeammateScreen;
