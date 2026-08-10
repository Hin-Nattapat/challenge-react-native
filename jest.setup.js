/* eslint-env jest */

// Insets need a native measurement pass that react-test-renderer cannot run.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
