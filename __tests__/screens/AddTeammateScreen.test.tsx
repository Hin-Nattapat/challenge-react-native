import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCreateUser } from '../../src/hooks/users';
import type { RootStackParamList } from '../../src/navigation/types';
import AddTeammateScreen from '../../src/screens/AddTeammateScreen';

jest.mock('../../src/hooks/users', () => ({
  useCreateUser: jest.fn(),
}));

const useCreateUserMock = useCreateUser as jest.MockedFunction<
  typeof useCreateUser
>;
const mutate = jest.fn();
const reset = jest.fn();
const popTo = jest.fn();
const navigation = {
  popTo,
} as unknown as NativeStackNavigationProp<RootStackParamList, 'AddTeammate'>;

const renderScreen = () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    tree = ReactTestRenderer.create(
      <AddTeammateScreen navigation={navigation} />,
    );
  });

  return tree!;
};

describe('AddTeammateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCreateUserMock.mockReturnValue({
      mutate,
      reset,
    } as unknown as ReturnType<typeof useCreateUser>);
  });

  test('validates every required field before creating', () => {
    const tree = renderScreen();

    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Create teammate' })
        .props.onPress(),
    );

    expect(
      tree.root.findByProps({ children: 'Name is required' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ children: 'Email is required' }),
    ).toBeTruthy();
    expect(tree.root.findByProps({ children: 'Job is required' })).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });

  test('creates a teammate with trimmed values', () => {
    const tree = renderScreen();

    act(() => {
      tree.root
        .findByProps({ accessibilityLabel: 'Name' })
        .props.onChangeText(' Jane Doe ');
      tree.root
        .findByProps({ accessibilityLabel: 'Email' })
        .props.onChangeText(' jane@example.com ');
      tree.root
        .findByProps({ accessibilityLabel: 'Job' })
        .props.onChangeText(' Engineer ');
    });
    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Create teammate' })
        .props.onPress(),
    );

    expect(mutate).toHaveBeenCalledWith(
      { name: 'Jane Doe', email: 'jane@example.com', job: 'Engineer' },
      expect.any(Object),
    );
  });

  test('rejects a malformed email', () => {
    const tree = renderScreen();

    act(() => {
      tree.root
        .findByProps({ accessibilityLabel: 'Name' })
        .props.onChangeText('Jane Doe');
      tree.root
        .findByProps({ accessibilityLabel: 'Email' })
        .props.onChangeText('jane@example');
      tree.root
        .findByProps({ accessibilityLabel: 'Job' })
        .props.onChangeText('Engineer');
    });
    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Create teammate' })
        .props.onPress(),
    );

    expect(
      tree.root.findByProps({ children: 'Enter a valid email' }),
    ).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });

  test('disables submit while creating', () => {
    useCreateUserMock.mockReturnValue({
      isPending: true,
      mutate,
      reset,
    } as unknown as ReturnType<typeof useCreateUser>);

    const tree = renderScreen();

    const submit = tree.root.findByProps({
      accessibilityLabel: 'Creating teammate',
    });

    expect(submit.props.disabled).toBe(true);
    expect(submit.props.accessibilityState).toEqual({ disabled: true });
  });

  test('returns to the list with the created name once the API accepts it', () => {
    const tree = renderScreen();

    act(() => {
      tree.root
        .findByProps({ accessibilityLabel: 'Name' })
        .props.onChangeText('Jane Doe');
      tree.root
        .findByProps({ accessibilityLabel: 'Email' })
        .props.onChangeText('jane@example.com');
      tree.root
        .findByProps({ accessibilityLabel: 'Job' })
        .props.onChangeText('Engineer');
    });
    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Create teammate' })
        .props.onPress(),
    );
    act(() => mutate.mock.calls[0][1].onSuccess());

    expect(popTo).toHaveBeenCalledWith('UserList', {
      createdTeammateName: 'Jane Doe',
    });
  });

  test('shows the API error', () => {
    useCreateUserMock.mockReturnValue({
      error: new Error('Request failed'),
      isError: true,
      mutate,
      reset,
    } as unknown as ReturnType<typeof useCreateUser>);

    const tree = renderScreen();

    expect(tree.root.findByProps({ children: 'Request failed' })).toBeTruthy();
    expect(popTo).not.toHaveBeenCalled();
  });

  test('clears a validation error once the field is edited', () => {
    const tree = renderScreen();

    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Create teammate' })
        .props.onPress(),
    );
    expect(
      tree.root.findByProps({ children: 'Name is required' }),
    ).toBeTruthy();

    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Name' })
        .props.onChangeText('Jane Doe'),
    );

    expect(
      tree.root.findAllByProps({ children: 'Name is required' }),
    ).toHaveLength(0);
    expect(tree.root.findByProps({ children: 'Job is required' })).toBeTruthy();
  });

  test('drops a stale error once the form is edited again', () => {
    useCreateUserMock.mockReturnValue({
      error: new Error('Request failed'),
      isError: true,
      mutate,
      reset,
    } as unknown as ReturnType<typeof useCreateUser>);

    const tree = renderScreen();

    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Name' })
        .props.onChangeText('Jane Doe'),
    );

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
