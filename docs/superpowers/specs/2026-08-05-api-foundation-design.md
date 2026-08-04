# API Foundation Design

## Goal

Add the smallest typed data-access foundation required by the Team Directory flows. This phase configures ReqRes access, shared request behavior, TanStack Query, and reusable user hooks without connecting remote data to the screens or implementing form behavior.

## Scope

This phase includes:

- `react-native-dotenv` configuration for the ReqRes base URL and API key
- a shared `fetch` client
- typed functions for listing, reading, and creating users
- TanStack Query provider and user hooks
- focused tests for request behavior, endpoints, and hooks
- setup and environment documentation

This phase excludes screen integration, loading/error/empty UI, form validation, final visual design, pagination, retries beyond TanStack Query defaults, cache updates after creation, runtime schema validation, Axios, repository/service layers, and generic utilities without a current consumer.

## Project Structure

```text
src/
├── api/
│   ├── client.ts
│   └── users.ts
├── config/
│   └── env.ts
├── hooks/
│   └── users.ts
├── providers/
│   └── QueryProvider.tsx
└── types/
    ├── env.d.ts
    └── user.ts
```

The structure remains layer-first because the application has one small domain. No empty `utils` folder or feature architecture is created.

## Environment Configuration

The application reads two required values through `react-native-dotenv`:

- `API_BASE_URL`
- `REQRES_API_KEY`

`.env.example` documents both variables with a non-working sample key. `.env` is ignored and must never be committed. `src/config/env.ts` is the only application module that imports from `@env`; it trims and validates both values when loaded and throws a clear configuration error when either is empty.

Environment injection prevents accidental repository leakage. It does not make a key secret in a mobile bundle. The README states this limitation explicitly.

## Shared API Client

`src/api/client.ts` exports a small generic JSON request function built on React Native's global `fetch`. It:

- joins the configured base URL with an endpoint
- sends `x-api-key` on every request
- sends `Content-Type: application/json` when a body is present
- serializes request bodies as JSON
- parses successful JSON responses
- throws an `Error` for network failures and non-2xx responses

For non-2xx responses, the client uses a server-provided JSON `error` value when it is a string. Otherwise it falls back to `Request failed with status <code>`. Callers do not compare raw HTTP status numbers because `response.ok` represents the success range.

`HttpMethod` contains only methods that must be stated explicitly in this phase. `POST` is represented by `HttpMethod.Post`; GET requests use the native fetch default and do not specify a redundant method.

## User API and Types

`src/types/user.ts` defines:

- `User`
- `UserListResponse`
- `UserDetailResponse`
- `CreateUserRequest`
- `CreateUserResponse`

Domain and transport types use descriptive names without forced `I` or `T` prefixes. Component props continue to use the agreed `IProps` convention.

`src/api/users.ts` owns the named `USERS_ENDPOINT` constant and exports:

- `getUsers()` for `GET /users?page=1`
- `getUser(userId)` for `GET /users/{id}`
- `createUser(request)` for `POST /users`

The functions return the ReqRes transport shapes directly. No mapper is added because the current UI requirements use the same fields and no model transformation exists.

## TanStack Query Integration

`QueryProvider` creates one `QueryClient` for the application lifetime and wraps its children with `QueryClientProvider`. It uses an `IProps` interface, destructures props inside an arrow component, and exports the component as default.

`src/hooks/users.ts` exports:

- `useUsers()` with query key `[QueryKey.Users]`
- `useUser(userId)` with query key `[QueryKey.Users, userId]`
- `useCreateUser()` using the create-user mutation function

`QueryKey.Users` avoids repeated domain magic strings. No query-key factory is introduced for two query shapes. The create mutation does not modify or invalidate the list because the challenge states that ReqRes accepts the call without persisting the created user.

The provider keeps TanStack Query's defaults until screen behavior provides evidence for a different retry or cache policy.

## Constants and Enums

Enums are limited to finite values that are reused or replace conditional magic values:

- `HttpMethod.Post`
- `QueryKey.Users`

Single fixed values use named constants, such as `USERS_ENDPOINT`. Standard header names, error copy, and one-time literals do not receive enums. This keeps comparisons explicit without turning every string into a new abstraction.

## Data Flow

```text
Screen (future phase)
  → useUsers / useUser / useCreateUser
  → user API functions
  → shared fetch client
  → ReqRes
```

API functions are independent of React and TanStack Query. Hooks coordinate remote state but contain no presentation behavior.

## Testing

Tests use Jest's existing setup and deterministic mocks; no live API key or network request is required.

Coverage verifies:

- base URL and `x-api-key` application
- JSON headers and body serialization for POST
- readable non-2xx errors
- list, detail, and create endpoint/method selection
- query keys and query/mutation function wiring
- the existing application render test after adding `QueryProvider`

Tests do not assert TanStack Query's implementation details or duplicate library behavior.

## Documentation

README setup instructions will cover:

- installing npm and CocoaPods dependencies
- copying `.env.example` to `.env`
- supplying a ReqRes API key
- starting Metro
- running iOS and Android
- the client-side environment security limitation

The original interview requirements remain unchanged in `CHALLENGE.md`.

## Completion Criteria

- the environment contract is typed, documented, and excludes real keys from Git
- all three ReqRes operations are available as typed functions and TanStack hooks
- the query provider is mounted without changing screen behavior
- unit tests, ESLint, TypeScript, and Prettier pass
- the existing app still builds and launches on iOS and Android
