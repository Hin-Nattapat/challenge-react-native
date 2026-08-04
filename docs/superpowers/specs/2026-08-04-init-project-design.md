# Init Project Design

## Goal

Create the smallest React Native CLI foundation that proves the project starts on iOS and Android and that the required screens are connected by stack navigation. Business logic, API access, form behavior, and visual polish are separate milestones.

## Technology

- React Native CLI 0.84 with the TypeScript template
- npm
- React Navigation native stack
- React Native's built-in `StyleSheet`
- Xcode and iOS Simulator for iOS verification
- JDK 17 and Android SDK command-line tools, emulator, and ARM64 system image for Android verification

TanStack Query and environment configuration are intentionally deferred until the API milestone, when they have active consumers. No general-purpose state library, form library, UI kit, test framework, path alias, or custom design system is added.

## Runtime Structure

```text
App.tsx
src/
  navigation/
    RootNavigator.tsx
    types.ts
  screens/
    UserListScreen.tsx
    UserDetailScreen.tsx
    AddTeammateScreen.tsx
```

`App.tsx` owns the navigation container. `RootNavigator.tsx` owns the native stack and screen registration. `types.ts` owns the stack parameter list. Each screen file owns one independently meaningful placeholder screen.

Directories such as `api`, `hooks`, `utils`, `components`, and additional type modules do not exist until a concrete implementation needs them.

## Navigation

The initial route is the user list. Its placeholder exposes an action to open the add-teammate screen and a temporary action to open the detail screen with a typed sample user ID. The detail screen receives the typed ID and uses standard stack back behavior. These controls prove all required routes are reachable without implementing business behavior.

## Placeholder UI

Placeholder screens use built-in React Native components and `StyleSheet` only. They provide readable screen names and minimum controls required to exercise navigation. They do not establish the final visual direction, reusable components, API states, or production copy.

iOS edge-swipe/system back and Android system Back remain owned by the native stack. Content respects safe areas through the navigation container and native headers.

## Data and Errors

There is no remote data flow in this milestone. Consequently, no query provider, API client, loading state, or error abstraction is created. Native build or startup failures are fixed at their source rather than hidden by application code.

## Verification

- Install JavaScript dependencies with npm.
- Install iOS pods using the template-supported workflow.
- Run the existing smallest smoke test for the application shell.
- Run TypeScript checking and linting supplied by the React Native template.
- Build and launch on an iOS Simulator.
- Build and launch on an Android ARM64 emulator created with command-line tools.
- Record the exact simulator/emulator and tooling versions later in the candidate README deliverable.

## Explicitly Deferred

- ReqRes requests and response types
- TanStack Query provider, queries, and mutations
- `.env`, API-key injection, and API client configuration
- Loading, empty, error, success, and validation states
- Final UI direction, shared components, accessibility polish, and optional bonus work
- Pagination, pull-to-refresh, image fallback, and tests beyond the minimal shell check
