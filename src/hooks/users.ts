import { useMutation, useQuery } from '@tanstack/react-query';
import { createUser, getUser, getUsers } from '../api/users';

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

export const useCreateUser = () => useMutation({ mutationFn: createUser });
