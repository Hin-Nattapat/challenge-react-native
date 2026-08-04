# API Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add typed ReqRes access, environment configuration, and TanStack Query hooks without connecting remote data to the screens.

**Architecture:** A small layer-first structure separates environment access, shared transport behavior, user endpoints, query hooks, and the query provider. API functions remain independent of React; hooks adapt those functions to TanStack Query; screens remain unchanged.

**Tech Stack:** React Native 0.84, TypeScript, npm, built-in `fetch`, `react-native-dotenv`, TanStack Query, Jest

## Global Constraints

- Work only on a feature branch created from the latest `origin/develop`.
- Use `API_BASE_URL` and `REQRES_API_KEY`; never commit a real API key.
- Use `useUsers`, `useUser`, `useCreateUser`, and `CreateUserRequest` exactly as named.
- Domain types have descriptive names without forced I/T prefixes; component props use `IProps`.
- Components are arrow functions, destructure props inside the body, and use a separate default export.
- Use `HttpMethod.Post`, `QueryKey.Users`, and `USERS_ENDPOINT`; do not enum one-time literals.
- Keep TanStack Query defaults and do not update cache after create.
- Do not connect hooks to screens or implement remote-state UI in this phase.
- Do not add Axios, runtime schemas, repositories, services, form libraries, or generic utils.
- Use deterministic offline tests and preserve `CHALLENGE.md`.

---

### Task 1: Environment Contract and Dependencies

**Files:**

- Modify: `package.json`, `package-lock.json`, `babel.config.js`, `.gitignore`
- Create: `.env.example`, `src/types/env.d.ts`, `src/config/env.ts`
- Test: `__tests__/config/env.test.ts`

**Interfaces:**

- Consumes: local `API_BASE_URL` and `REQRES_API_KEY`
- Produces: `getRequiredEnv(name, value): string` and `env.apiBaseUrl/env.reqresApiKey`

- [ ] **Step 1: Install dependencies**

```bash
rtk npm install @tanstack/react-query
rtk npm install --save-dev react-native-dotenv
```

- [ ] **Step 2: Write the failing environment test**

```ts
import { getRequiredEnv } from '../../src/config/env';

describe('getRequiredEnv', () => {
  test('trims a configured value', () => {
    expect(getRequiredEnv('API_BASE_URL', ' https://reqres.in/api ')).toBe(
      'https://reqres.in/api',
    );
  });

  test.each([undefined, '', '   '])('rejects missing value %p', value => {
    expect(() => getRequiredEnv('REQRES_API_KEY', value)).toThrow(
      'Missing environment variable: REQRES_API_KEY',
    );
  });
});
```

- [ ] **Step 3: Verify RED**

Run: `rtk npm test -- --runInBand __tests__/config/env.test.ts`

Expected: FAIL because `src/config/env.ts` is absent.

- [ ] **Step 4: Implement configuration**

Configure `babel.config.js` with `module:react-native-dotenv`, `moduleName: '@env'`, `path: '.env'`, an allowlist containing only both approved variables, and `allowUndefined: true`. Babel must keep `module:@react-native/babel-preset` and disable its cache. Runtime validation remains in `env.ts`.

Append:

```gitignore
.env
.env.*
!.env.example
```

Create `.env.example`:

```dotenv
API_BASE_URL=https://reqres.in/api
REQRES_API_KEY=replace-with-your-reqres-api-key
```

Create the ignored local file used by Metro and Jest:

```bash
rtk cp .env.example .env
```

Create `src/types/env.d.ts`:

```ts
declare module '@env' {
  export const API_BASE_URL: string | undefined;
  export const REQRES_API_KEY: string | undefined;
}
```

Create `src/config/env.ts`:

```ts
import { API_BASE_URL, REQRES_API_KEY } from '@env';

export const getRequiredEnv = (
  name: string,
  value: string | undefined,
): string => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return trimmedValue;
};

export const env = {
  apiBaseUrl: getRequiredEnv('API_BASE_URL', API_BASE_URL),
  reqresApiKey: getRequiredEnv('REQRES_API_KEY', REQRES_API_KEY),
};
```

- [ ] **Step 5: Verify GREEN and commit**

```bash
rtk npm test -- --runInBand __tests__/config/env.test.ts
rtk npx tsc --noEmit
rtk npm run lint
rtk git add package.json package-lock.json babel.config.js .gitignore .env.example src/types/env.d.ts src/config/env.ts __tests__/config/env.test.ts
rtk git commit -m "chore(api): configure environment and query dependencies"
```

---

### Task 2: Shared Fetch Client and Typed User Endpoints

**Files:**

- Create: `src/api/client.ts`, `src/api/users.ts`, `src/types/user.ts`
- Test: `__tests__/api/client.test.ts`, `__tests__/api/users.test.ts`

**Interfaces:**

- Produces: `HttpMethod.Post`, generic `apiRequest`, three user API functions, and five approved user types

- [ ] **Step 1: Write failing client tests**

Mock `src/config/env` and `global.fetch`. Assert:

```ts
await apiRequest('/users?page=1');
expect(fetch).toHaveBeenCalledWith('https://reqres.in/api/users?page=1', {
  headers: { 'x-api-key': 'test-api-key' },
});

await apiRequest('/users', {
  method: HttpMethod.Post,
  body: { name: 'Jane', job: 'Engineer' },
});
expect(fetch).toHaveBeenCalledWith('https://reqres.in/api/users', {
  method: HttpMethod.Post,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'test-api-key',
  },
  body: JSON.stringify({ name: 'Jane', job: 'Engineer' }),
});
```

Also assert a failed response with `{ error: 'Forbidden' }` throws `Forbidden`, while an empty 500 response throws `Request failed with status 500`.

- [ ] **Step 2: Verify client RED**

Run: `rtk npm test -- --runInBand __tests__/api/client.test.ts`

Expected: FAIL because `src/api/client.ts` is absent.

- [ ] **Step 3: Implement the client**

```ts
import { env } from '../config/env';

export enum HttpMethod {
  Post = 'POST',
}

interface IRequestOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
}

interface IErrorResponse {
  error?: unknown;
}

export const apiRequest = async <TResponse, TBody = never>(
  endpoint: string,
  options: IRequestOptions<TBody> = {},
): Promise<TResponse> => {
  const { body, method } = options;
  const headers: Record<string, string> = {
    'x-api-key': env.reqresApiKey,
  };
  const request: RequestInit = { headers };

  if (method) request.method = method;
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    request.body = JSON.stringify(body);
  }

  const response = await fetch(`${env.apiBaseUrl}${endpoint}`, request);
  const responseBody: unknown = await response.json();

  if (!response.ok) {
    const error = (responseBody as IErrorResponse).error;
    throw new Error(
      typeof error === 'string'
        ? error
        : `Request failed with status ${response.status}`,
    );
  }

  return responseBody as TResponse;
};
```

- [ ] **Step 4: Write failing endpoint tests**

Mock `apiRequest` and assert:

```ts
await getUsers();
expect(apiRequest).toHaveBeenCalledWith('/users?page=1');

await getUser(2);
expect(apiRequest).toHaveBeenCalledWith('/users/2');

const request = { name: 'Jane', job: 'Engineer' };
await createUser(request);
expect(apiRequest).toHaveBeenCalledWith('/users', {
  method: HttpMethod.Post,
  body: request,
});
```

- [ ] **Step 5: Verify endpoint RED**

Run: `rtk npm test -- --runInBand __tests__/api/users.test.ts`

Expected: FAIL because `src/api/users.ts` is absent.

- [ ] **Step 6: Add transport types**

```ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export interface UserDetailResponse {
  data: User;
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface CreateUserResponse extends CreateUserRequest {
  id: string;
  createdAt: string;
}
```

- [ ] **Step 7: Implement `USERS_ENDPOINT`, `getUsers`, `getUser`, and `createUser`**

Use `apiRequest<UserListResponse>(`${USERS_ENDPOINT}?page=1`)`, `apiRequest<UserDetailResponse>(`${USERS_ENDPOINT}/${userId}`)`, and `apiRequest<CreateUserResponse, CreateUserRequest>(USERS_ENDPOINT, { method: HttpMethod.Post, body: request })`.

- [ ] **Step 8: Verify GREEN and commit**

```bash
rtk npm test -- --runInBand __tests__/api/client.test.ts __tests__/api/users.test.ts
rtk npx tsc --noEmit
rtk npm run lint
rtk git add src/api/client.ts src/api/users.ts src/types/user.ts __tests__/api/client.test.ts __tests__/api/users.test.ts
rtk git commit -m "feat(api): add typed ReqRes user client"
```

---

### Task 3: Query Provider and User Hooks

**Files:**

- Create: `src/providers/QueryProvider.tsx`, `src/hooks/users.ts`
- Modify: `App.tsx`
- Test: `__tests__/hooks/users.test.ts`, existing `__tests__/App.test.tsx`

**Interfaces:**

- Produces: `QueryProvider`, `QueryKey.Users`, `useUsers()`, `useUser(userId)`, and `useCreateUser()`

- [ ] **Step 1: Write failing hook tests**

Mock TanStack's `useQuery/useMutation` and all three API functions. Assert:

```ts
useUsers();
expect(useQuery).toHaveBeenCalledWith({
  queryKey: [QueryKey.Users],
  queryFn: getUsers,
});

useUser(2);
expect(useQuery).toHaveBeenCalledWith({
  queryKey: [QueryKey.Users, 2],
  queryFn: expect.any(Function),
});

useCreateUser();
expect(useMutation).toHaveBeenCalledWith({ mutationFn: createUser });
```

Invoke the captured detail `queryFn` and assert `getUser(2)`.

- [ ] **Step 2: Verify RED**

Run: `rtk npm test -- --runInBand __tests__/hooks/users.test.ts`

Expected: FAIL because `src/hooks/users.ts` is absent.

- [ ] **Step 3: Implement hooks**

```ts
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
```

- [ ] **Step 4: Add and mount provider**

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const QueryProvider = (props: IProps) => {
  const { children } = props;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
```

Wrap the existing `NavigationContainer` in `App.tsx` with `QueryProvider`. Do not edit screens.

- [ ] **Step 5: Verify GREEN and commit**

```bash
rtk npm test -- --runInBand __tests__/hooks/users.test.ts __tests__/App.test.tsx
rtk npx tsc --noEmit
rtk npm run lint
rtk git add src/providers/QueryProvider.tsx src/hooks/users.ts App.tsx __tests__/hooks/users.test.ts
rtk git commit -m "feat(api): add query provider and user hooks"
```

---

### Task 4: Documentation and Verification

**Files:**

- Modify: `README.md`

**Interfaces:**

- Produces: reviewer-facing setup, environment, run, and check instructions

- [ ] **Step 1: Replace README placeholder**

Document:

- title and `CHALLENGE.md` link
- Node 22.11+, npm, Xcode/CocoaPods, JDK 17, Android command-line tools
- `rtk npm install`, copying `.env.example`, and `bundle exec pod install`
- ReqRes key setup and the fact that client environment values are not secret storage
- `rtk npm start`, `rtk npm run ios`, and `rtk npm run android`
- Jest, ESLint, and TypeScript commands
- verified iPhone 17 Pro/iOS 26.5 and Android API 36 environments

- [ ] **Step 2: Verify automated checks and tracked env files**

```bash
rtk npx prettier --check .
rtk npm test -- --runInBand
rtk npm run lint
rtk npx tsc --noEmit
rtk git diff --check
rtk git ls-files '.env*'
```

Expected: all checks pass and `.env.example` is the only tracked env file.

- [ ] **Step 3: Verify both native targets**

With Metro and a valid local `.env`:

```bash
rtk npm run ios -- --simulator="iPhone 17 Pro"
rtk npm run android -- --active-arch-only
```

Expected: both open the unchanged shell without a red screen; no API request occurs.

- [ ] **Step 4: Commit docs and run the final gate**

```bash
rtk git add README.md
rtk git commit -m "docs(project): document setup and run commands"
rtk npm test -- --runInBand
rtk npm run lint
rtk npx tsc --noEmit
rtk npx prettier --check .
rtk git diff --check
rtk git status --short --branch
```

Expected: all checks pass and the feature branch is clean.
