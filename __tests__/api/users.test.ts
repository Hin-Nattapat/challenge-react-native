jest.mock('../../src/api/client', () => ({
  apiRequest: jest.fn(),
  HttpMethod: { Post: 'POST' },
}));

import { apiRequest, HttpMethod } from '../../src/api/client';
import { createUser, getUser, getUsers } from '../../src/api/users';

const apiRequestMock = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('user endpoints', () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  test('gets the first page of users', async () => {
    await getUsers();

    expect(apiRequestMock).toHaveBeenCalledWith('/users?page=1');
  });

  test('gets a user by ID', async () => {
    await getUser(2);

    expect(apiRequestMock).toHaveBeenCalledWith('/users/2');
  });

  test('creates a user with the supplied request', async () => {
    const request = { name: 'Jane', job: 'Engineer' };

    await createUser(request);

    expect(apiRequestMock).toHaveBeenCalledWith('/users', {
      method: HttpMethod.Post,
      body: request,
    });
  });
});
