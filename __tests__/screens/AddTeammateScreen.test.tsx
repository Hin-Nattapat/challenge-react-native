import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { useCreateUser } from '../../src/hooks/users';
import AddTeammateScreen from '../../src/screens/AddTeammateScreen';

jest.mock('../../src/hooks/users', () => ({
  useCreateUser: jest.fn(),
}));

const useCreateUserMock = useCreateUser as jest.MockedFunction<
  typeof useCreateUser
>;
const mutate = jest.fn();
const reset = jest.fn();

const renderScreen = () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    tree = ReactTestRenderer.create(<AddTeammateScreen />);
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

  test('validates both required fields before creating', () => {
    const tree = renderScreen();

    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Create teammate' })
        .props.onPress(),
    );

    expect(
      tree.root.findByProps({ children: 'Name is required' }),
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
        .findByProps({ accessibilityLabel: 'Job' })
        .props.onChangeText(' Engineer ');
    });
    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Create teammate' })
        .props.onPress(),
    );

    expect(mutate).toHaveBeenCalledWith(
      { name: 'Jane Doe', job: 'Engineer' },
      expect.any(Object),
    );
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

  test.each([
    [{ isError: true, error: new Error('Request failed') }, 'Request failed'],
    [{ isSuccess: true }, 'Teammate created'],
  ])('shows mutation feedback', (mutationState, message) => {
    useCreateUserMock.mockReturnValue({
      mutate,
      reset,
      ...mutationState,
    } as unknown as ReturnType<typeof useCreateUser>);

    const tree = renderScreen();

    expect(tree.root.findByProps({ children: message })).toBeTruthy();
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

  test('drops stale mutation feedback once the form is edited again', () => {
    useCreateUserMock.mockReturnValue({
      isSuccess: true,
      mutate,
      reset,
    } as unknown as ReturnType<typeof useCreateUser>);

    const tree = renderScreen();
    expect(
      tree.root.findByProps({ children: 'Teammate created' }),
    ).toBeTruthy();

    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Name' })
        .props.onChangeText('Jane Doe'),
    );

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
