import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
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
const navigation = {
  navigate,
} as unknown as NativeStackNavigationProp<RootStackParamList, 'UserList'>;

const renderScreen = () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    tree = ReactTestRenderer.create(<UserListScreen navigation={navigation} />);
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
});
