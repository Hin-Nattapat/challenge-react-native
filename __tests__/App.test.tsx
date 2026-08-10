/**
 * @format
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../App';

jest.mock('../src/hooks/users', () => ({
  useUsers: () => ({ isPending: true }),
}));

// Mocked so the suite does not depend on whatever .env the machine happens to have.
let mockMissingEnvVars: string[] = [];

jest.mock('../src/config/env', () => ({
  env: { apiBaseUrl: 'https://reqres.in/api', reqresApiKey: 'test-api-key' },
  get missingEnvVars() {
    return mockMissingEnvVars;
  },
}));

const renderApp = async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  return tree!;
};

beforeEach(() => {
  mockMissingEnvVars = [];
});

test('renders the team directory navigation shell once configured', async () => {
  const tree = await renderApp();

  expect(
    tree.root.findByProps({ accessibilityLabel: 'Open add teammate' }),
  ).toBeTruthy();
});

test('explains the configuration instead of starting the app', async () => {
  mockMissingEnvVars = ['REQRES_API_KEY'];

  const tree = await renderApp();

  expect(
    tree.root.findByProps({ children: 'Configuration needed' }),
  ).toBeTruthy();
  expect(
    tree.root.findAllByProps({ accessibilityLabel: 'Open add teammate' }),
  ).toHaveLength(0);
});
