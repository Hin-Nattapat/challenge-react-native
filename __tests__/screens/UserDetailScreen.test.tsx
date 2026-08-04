import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import type { RouteProp } from '@react-navigation/native';
import { useUser } from '../../src/hooks/users';
import type { RootStackParamList } from '../../src/navigation/types';
import UserDetailScreen from '../../src/screens/UserDetailScreen';

jest.mock('../../src/hooks/users', () => ({
  useUser: jest.fn(),
}));

const useUserMock = useUser as jest.MockedFunction<typeof useUser>;
const route = {
  key: 'UserDetail-test',
  name: 'UserDetail',
  params: { userId: 1 },
} as RouteProp<RootStackParamList, 'UserDetail'>;

const renderScreen = () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    tree = ReactTestRenderer.create(<UserDetailScreen route={route} />);
  });

  return tree!;
};

describe('UserDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads the routed teammate', () => {
    useUserMock.mockReturnValue({ isPending: true } as ReturnType<
      typeof useUser
    >);

    const tree = renderScreen();

    expect(useUserMock).toHaveBeenCalledWith(1);
    expect(
      tree.root.findByProps({ accessibilityLabel: 'Loading teammate' }),
    ).toBeTruthy();
  });

  test('shows an error with retry', () => {
    const refetch = jest.fn();
    useUserMock.mockReturnValue({
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useUser>);

    const tree = renderScreen();

    expect(
      tree.root.findByProps({ children: 'Could not load teammate' }),
    ).toBeTruthy();
    act(() =>
      tree.root
        .findByProps({ accessibilityLabel: 'Retry loading teammate' })
        .props.onPress(),
    );
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test('shows the teammate profile', () => {
    useUserMock.mockReturnValue({
      data: {
        data: {
          id: 1,
          email: 'george.bluth@reqres.in',
          first_name: 'George',
          last_name: 'Bluth',
          avatar: 'https://reqres.in/img/faces/1-image.jpg',
        },
      },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useUser>);

    const tree = renderScreen();

    expect(
      tree.root.findByProps({ accessibilityLabel: 'George Bluth' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ children: 'george.bluth@reqres.in' }),
    ).toBeTruthy();
  });
});
