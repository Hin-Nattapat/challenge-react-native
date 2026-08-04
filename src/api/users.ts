import { apiRequest, HttpMethod } from './client';
import type {
  CreateUserRequest,
  CreateUserResponse,
  UserDetailResponse,
  UserListResponse,
} from '../types/user';

export const USERS_ENDPOINT = '/users';

export const getUsers = (): Promise<UserListResponse> =>
  apiRequest<UserListResponse>(`${USERS_ENDPOINT}?page=1`);

export const getUser = (userId: number): Promise<UserDetailResponse> =>
  apiRequest<UserDetailResponse>(`${USERS_ENDPOINT}/${userId}`);

export const createUser = (
  request: CreateUserRequest,
): Promise<CreateUserResponse> =>
  apiRequest<CreateUserResponse, CreateUserRequest>(USERS_ENDPOINT, {
    method: HttpMethod.Post,
    body: request,
  });
