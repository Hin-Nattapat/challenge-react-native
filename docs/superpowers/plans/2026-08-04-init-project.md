# Init Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a typed React Native CLI app that launches on iOS and Android and connects the three required placeholder screens with native stack navigation.

**Architecture:** `App.tsx` contains only the navigation container, `RootNavigator` registers the typed route map, and each screen owns one placeholder surface. API, query, environment, reusable UI, and business-state layers remain absent until they have real consumers.

**Tech Stack:** React Native CLI 0.84, TypeScript, npm, React Navigation 7 native stack, built-in React Native components and `StyleSheet`, Xcode/iOS Simulator, JDK 17, Android SDK command-line tools/Android Emulator.

## Global Constraints

- Preserve the user's uncommitted `README.md`; never copy, stage, or overwrite it.
- Work only on `chore/init-react-native-project`, based on `origin/develop`.
- Use React Native CLI, not Expo.
- Use npm and commit `package-lock.json`.
- Install no Android Studio, state library, query library, form library, UI kit, environment library, path alias, or custom design system.
- Create no empty `api`, `hooks`, `utils`, `components`, or speculative type directories.
- Keep standard iOS and Android back behavior and native headers.
- Do not implement ReqRes access, forms, loading states, errors, or final visual design.

---

### Task 1: Native Toolchain and React Native Scaffold

**Files:**

- Generate: React Native CLI 0.84 template files at the repository root
- Preserve unchanged: `README.md`, `PRODUCT.md`, `docs/`

**Interfaces:**

- Consumes: Node 22.11.0 or newer, npm, Xcode, CocoaPods
- Produces: runnable React Native application named `TeamDirectory`, npm scripts, iOS project, Android project

- [ ] **Step 1: Install only the missing Android command-line prerequisites**

Install JDK 17 and command-line tools through Homebrew:

```bash
brew install openjdk@17
brew install --cask android-commandlinetools
```

Use `/Users/calypso/Library/Android/sdk` as the SDK root. Install only the packages required by the current React Native toolchain and an Apple Silicon emulator:

```bash
sdkmanager --sdk_root=/Users/calypso/Library/Android/sdk \
  "platform-tools" \
  "platforms;android-36" \
  "build-tools;36.0.0" \
  "emulator" \
  "system-images;android-36;google_apis;arm64-v8a"
```

Accept the Android SDK licenses and configure the shell outside the repository with:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME=/Users/calypso/Library/Android/sdk
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

Verify:

```bash
java -version
sdkmanager --version
adb version
emulator -version
```

Expected: Java reports version 17 and each Android tool exits successfully.

- [ ] **Step 2: Generate the pinned template outside the non-empty repository**

```bash
mkdir -p /private/tmp/team-directory-init
cd /private/tmp/team-directory-init
npx @react-native-community/cli@latest init TeamDirectory --version 0.84.0 --pm npm
```

Expected: `/private/tmp/team-directory-init/TeamDirectory` contains the TypeScript React Native template.

- [ ] **Step 3: Copy the generated application without touching repository-owned files**

From the repository root, copy generated files while excluding Git metadata and the generated README:

```bash
rsync -a \
  --exclude=.git \
  --exclude=README.md \
  /private/tmp/team-directory-init/TeamDirectory/ ./
```

Run `git status --short` and confirm `README.md` remains the pre-existing user modification.

- [ ] **Step 4: Verify the untouched template before customization**

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```

Expected: the template test, lint, and TypeScript checks pass.

- [ ] **Step 5: Commit the runnable scaffold**

Stage generated project paths explicitly, excluding `README.md`, `PRODUCT.md`, and `docs/`:

```bash
git add .bundle .gitignore .prettierrc.js .watchmanconfig App.tsx Gemfile Gemfile.lock __tests__ android app.json babel.config.js index.js ios jest.config.js metro.config.js package.json package-lock.json tsconfig.json
git commit -m "chore: initialize React Native project"
```

Expected: the commit contains only the React Native scaffold.

---

### Task 2: Typed Native Stack Shell

**Files:**

- Modify: `App.tsx`
- Modify: `__tests__/App.test.tsx`
- Create: `src/navigation/RootNavigator.tsx`
- Create: `src/navigation/types.ts`
- Create: `src/screens/UserListScreen.tsx`
- Create: `src/screens/UserDetailScreen.tsx`
- Create: `src/screens/AddTeammateScreen.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify when CocoaPods resolves native dependencies: `ios/Podfile.lock`

**Interfaces:**

- Consumes: `NavigationContainer`, `createNativeStackNavigator`, `NativeStackScreenProps`
- Produces: `RootStackParamList` with `UserList`, `UserDetail`, and `AddTeammate`; a default `RootNavigator` component

- [ ] **Step 1: Install the minimum navigation dependencies**

```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens
npx pod-install ios
```

Expected: npm lockfile and iOS pods resolve without additional navigation or UI packages.

- [ ] **Step 2: Write the failing app-shell test**

Replace `__tests__/App.test.tsx` with:

```tsx
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../App';

test('renders the team directory navigation shell', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(
    tree!.root.findByProps({ accessibilityLabel: 'Open add teammate' }),
  ).toBeTruthy();
});
```

- [ ] **Step 3: Run the focused test and confirm the intended failure**

```bash
npm test -- --runInBand __tests__/App.test.tsx
```

Expected: FAIL because the untouched welcome screen has no `Open add teammate` control.

- [ ] **Step 4: Define the route contract**

Create `src/navigation/types.ts`:

```ts
export type RootStackParamList = {
  UserList: undefined;
  UserDetail: { userId: number };
  AddTeammate: undefined;
};
```

- [ ] **Step 5: Implement the three minimal placeholder screens**

Create `src/screens/UserListScreen.tsx`:

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UserList'>;

export default function UserListScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text>Team directory</Text>
      <Button
        accessibilityLabel="Open detail"
        title="Open detail"
        onPress={() => navigation.navigate('UserDetail', { userId: 1 })}
      />
      <Button
        accessibilityLabel="Open add teammate"
        title="Open add teammate"
        onPress={() => navigation.navigate('AddTeammate')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
});
```

Create `src/screens/UserDetailScreen.tsx`:

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;

export default function UserDetailScreen({ route }: Props) {
  return (
    <View style={styles.container}>
      <Text>User detail: {route.params.userId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
});
```

Create `src/screens/AddTeammateScreen.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';

export default function AddTeammateScreen() {
  return (
    <View style={styles.container}>
      <Text>Add teammate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
});
```

Do not create shared styles or components for this temporary UI.

- [ ] **Step 6: Register the typed native stack**

Create `src/navigation/RootNavigator.tsx`:

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTeammateScreen from '../screens/AddTeammateScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserListScreen from '../screens/UserListScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="UserList">
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={{ title: 'Team directory' }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{ title: 'Teammate' }}
      />
      <Stack.Screen
        name="AddTeammate"
        component={AddTeammateScreen}
        options={{ title: 'Add teammate' }}
      />
    </Stack.Navigator>
  );
}
```

Replace `App.tsx` with:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
```

- [ ] **Step 7: Run focused and static checks**

```bash
npm test -- --runInBand __tests__/App.test.tsx
npm run lint
npx tsc --noEmit
```

Expected: all commands pass.

- [ ] **Step 8: Commit the navigation shell**

```bash
git add App.tsx __tests__/App.test.tsx src package.json package-lock.json ios/Podfile.lock
git commit -m "feat: add typed navigation shell"
```

Expected: the commit contains navigation wiring and placeholder screens only.

---

### Task 3: iOS and Android Launch Verification

**Files:**

- Modify only if the generated toolchain requires a targeted compatibility fix: native project configuration directly responsible for the failure
- Do not modify: `README.md`

**Interfaces:**

- Consumes: the navigation shell from Task 2 and local simulator/emulator toolchains
- Produces: evidence that both native targets compile, launch, and navigate without a red screen

- [ ] **Step 1: Create and start the Android ARM64 emulator**

```bash
echo no | avdmanager create avd \
  --name TeamDirectory_API_36 \
  --package "system-images;android-36;google_apis;arm64-v8a" \
  --device pixel_7
emulator -avd TeamDirectory_API_36
```

Wait until `adb shell getprop sys.boot_completed` returns `1`.

- [ ] **Step 2: Start Metro once**

```bash
npm start
```

Keep Metro running for both launch checks.

- [ ] **Step 3: Build and launch Android**

```bash
npm run android
```

Expected: the app opens on `TeamDirectory_API_36`; list → detail, system Back, and list → add-teammate work without a red screen.

- [ ] **Step 4: Build and launch iOS**

```bash
npm run ios -- --simulator="iPhone 17 Pro"
```

Expected: the app opens; list → detail, edge-swipe/back button, and list → add-teammate work without a red screen.

- [ ] **Step 5: Run the final automated verification**

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```

Expected: all commands pass after native verification.

- [ ] **Step 6: Inspect the final diff and commit only targeted compatibility fixes**

```bash
git diff --check
git status --short
```

If Task 3 required tracked compatibility changes, stage their exact paths and commit:

```bash
git commit -m "fix: align native build configuration"
```

If no tracked compatibility changes were needed, create no empty verification commit. Keep the user's `README.md` modification unstaged.
