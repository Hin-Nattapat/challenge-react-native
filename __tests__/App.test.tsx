/**
 * @format
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../App';

test('renders the team directory navigation shell', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(
    tree!.root.findByProps({ accessibilityLabel: 'Open add teammate' }),
  ).toBeTruthy();
});
