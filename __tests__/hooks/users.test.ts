import { useMutation, useQuery } from '@tanstack/react-query';
import { createUser, getUser, getUsers } from '../../src/api/users';
import {
  QueryKey,
  toCreatedUser,
  useCreateUser,
  useUser,
  useUsers,
} from '../../src/hooks/users';

const mockSetQueryData = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
  useQueryClient: () => ({ setQueryData: mockSetQueryData }),
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

const created = {
  id: '512',
  name: 'Jane van Doe',
  email: 'jane@example.com',
  job: 'Engineer',
  createdAt: '2026-10-27T00:00:00.000Z',
};

test('uses the create endpoint for the create user mutation', () => {
  useCreateUser();

  expect(useMutation).toHaveBeenCalledWith(
    expect.objectContaining({ mutationFn: createUser }),
  );
});

test('maps a create response onto a directory user', () => {
  expect(toCreatedUser(created)).toEqual({
    id: 512,
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'van Doe',
    avatar: '',
  });
});

test('puts the created teammate at the top of the cached list', () => {
  useCreateUser();

  const { onSuccess } = (useMutation as jest.Mock).mock.calls[0][0];
  onSuccess(created);

  const [listKey, updateList] = mockSetQueryData.mock.calls[0];
  const george = { id: 1 };

  expect(listKey).toEqual([QueryKey.Users]);
  expect(updateList({ total: 12, data: [george] })).toEqual(
    expect.objectContaining({
      total: 13,
      data: [toCreatedUser(created), george],
    }),
  );
  expect(updateList(undefined)).toBeUndefined();
  expect(mockSetQueryData).toHaveBeenCalledWith([QueryKey.Users, 512], {
    data: toCreatedUser(created),
  });
});
