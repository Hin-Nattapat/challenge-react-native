import { useMutation, useQuery } from '@tanstack/react-query';
import { createUser, getUser, getUsers } from '../../src/api/users';
import {
  QueryKey,
  useCreateUser,
  useUser,
  useUsers,
} from '../../src/hooks/users';

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock('../../src/api/users', () => ({
  createUser: jest.fn(),
  getUser: jest.fn(),
  getUsers: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('uses the users endpoint for the users query', () => {
  useUsers();

  expect(useQuery).toHaveBeenCalledWith({
    queryKey: [QueryKey.Users],
    queryFn: getUsers,
  });
});

test('uses the requested id for the user detail query', () => {
  useUser(2);

  expect(useQuery).toHaveBeenCalledWith({
    queryKey: [QueryKey.Users, 2],
    queryFn: expect.any(Function),
  });

  const queryFn = (useQuery as jest.Mock).mock.calls[0][0].queryFn;
  queryFn();

  expect(getUser).toHaveBeenCalledWith(2);
});

test('uses the create endpoint for the create user mutation', () => {
  useCreateUser();

  expect(useMutation).toHaveBeenCalledWith({ mutationFn: createUser });
});
