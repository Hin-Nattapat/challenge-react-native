import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUsers } from '../../src/hooks/users';
import type { RootStackParamList } from '../../src/navigation/types';
import UserListScreen from '../../src/screens/UserListScreen';

jest.mock('../../src/hooks/users', () => ({
  useUsers: jest.fn(),
}));

const useUsersMock = useUsers as jest.MockedFunction<typeof useUsers>;
const george = {
  id: 1,
  email: 'george.bluth@reqres.in',
  first_name: 'George',
  last_name: 'Bluth',
  avatar: 'https://reqres.in/img/faces/1-image.jpg',
};
const navigate = jest.fn();
const setParams = jest.fn();
const navigation = {
  navigate,
  setParams,
} as unknown as NativeStackNavigationProp<RootStackParamList, 'UserList'>;

const renderScreen = (params?: RootStackParamList['UserList']) => {
  const route = {
    key: 'UserList-test',
    name: 'UserList',
    params,
  } as RouteProp<RootStackParamList, 'UserList'>;
  let tree: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    tree = ReactTestRenderer.create(
      <UserListScreen navigation={navigation} route={route} />,
    );
  });

  return tree!;
};

describe('UserListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state', () => {
    useUsersMock.mockReturnValue({ isPending: true } as ReturnType<
      typeof useUsers
    >);

    const tree = renderScreen();

    expect(
      tree.root.findByProps({ accessibilityLabel: 'Loading teammates' }),
    ).toBeTruthy();
  });

  test('shows an error with retry', () => {
    const refetch = jest.fn();
    useUsersMock.mockReturnValue({
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useUsers>);

    const tree = renderScreen();

    expect(
      tree.root.findByProps({ children: 'Could not load teammates' }),
    ).toBeTruthy();
    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Retry loading teammates' })
        .props.onPress(),
    );
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test('shows an empty state', () => {
    useUsersMock.mockReturnValue({
      data: { data: [] },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);

    const tree = renderScreen();

    expect(
      tree.root.findByProps({ children: 'No teammates found' }),
    ).toBeTruthy();
  });

  test('opens the selected teammate', () => {
    useUsersMock.mockReturnValue({
      data: { data: [george] },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);

    const tree = renderScreen();

    act(() =>
      tree.root
        .findByProps({
          accessibilityLabel: 'George Bluth, george.bluth@reqres.in',
        })
        .props.onPress(),
    );
    expect(navigate).toHaveBeenCalledWith('UserDetail', { userId: 1 });
  });

  test('falls back to initials when an avatar fails to load', () => {
    useUsersMock.mockReturnValue({
      data: { data: [george] },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);

    const tree = renderScreen();
    const avatar = { testID: 'avatar-image' };

    act(() => tree.root.findByProps(avatar).props.onError());

    expect(tree.root.findAllByProps(avatar)).toHaveLength(0);
    expect(tree.root.findByProps({ children: 'GB' })).toBeTruthy();
  });

  test('toasts a teammate created on the form, once', () => {
    useUsersMock.mockReturnValue({
      data: { data: [george] },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);

    const tree = renderScreen({ createdTeammateName: 'Jane Doe' });

    expect(
      tree.root.findByProps({ children: 'Jane Doe added to the team' }),
    ).toBeTruthy();
    expect(setParams).toHaveBeenCalledWith({ createdTeammateName: undefined });

    // Stops the toast's hide timer so it can't outlive the test.
    act(() => tree.unmount());
  });

  test('falls back to initials for a created teammate without an avatar', () => {
    useUsersMock.mockReturnValue({
      data: {
        data: [
          {
            id: 512,
            email: 'jane@example.com',
            first_name: 'Jane',
            last_name: 'Doe',
            avatar: '',
          },
        ],
      },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);

    const tree = renderScreen();

    expect(
      tree.root.findByProps({
        accessibilityLabel: 'Jane Doe, jane@example.com',
      }),
    ).toBeTruthy();
    expect(tree.root.findByProps({ children: 'JD' })).toBeTruthy();
  });
});
