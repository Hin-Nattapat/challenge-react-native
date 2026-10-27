import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getUser, getUsers } from '../api/users';
import type {
  CreateUserResponse,
  User,
  UserDetailResponse,
  UserListResponse,
} from '../types/user';

export enum QueryKey {
  Users = 'users',
}

export const useUsers = () =>
  useQuery({ queryKey: [QueryKey.Users], queryFn: getUsers });

export const useUser = (userId: number) =>
  useQuery({
    queryKey: [QueryKey.Users, userId],
    queryFn: () => getUser(userId),
  });

// ReqRes accepts the POST but never stores it, so the new teammate only lives
// in this session's cache and disappears on the next list refetch.
export const toCreatedUser = (response: CreateUserResponse): User => {
  const [firstName, ...lastNames] = response.name.split(/\s+/);

  return {
    id: Number(response.id),
    email: '',
    first_name: firstName,
    last_name: lastNames.join(' '),
    avatar: '',
    job: response.job,
  };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: response => {
      const user = toCreatedUser(response);

      queryClient.setQueryData<UserListResponse>(
        [QueryKey.Users],
        current =>
          current && {
            ...current,
            total: current.total + 1,
            data: [user, ...current.data],
          },
      );
      // Seeded so opening the row shows it; ReqRes would 404 this id.
      queryClient.setQueryData<UserDetailResponse>([QueryKey.Users, user.id], {
        data: user,
      });
    },
  });
};
