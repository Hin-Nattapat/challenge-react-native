# Team Directory

React Native implementation of the [Team Directory take-home challenge](./CHALLENGE.md).

## Prerequisites

- Node.js 22.11 or later and npm
- Xcode and CocoaPods for iOS
- JDK 17 and Android command-line tools for Android

## Setup

```sh
npm install
cp .env.example .env
cd ios && bundle exec pod install && cd ..
```

Set `REQRES_API_KEY` in `.env` to a valid ReqRes API key. `API_BASE_URL` is preconfigured for ReqRes. Environment values bundled into a client app are not secret storage; do not put credentials that must remain private in `.env`.

## Run

Start Metro in one terminal:

```sh
npm start
```

Then, in another terminal, launch a target:

```sh
npm run ios
npm run android
```

Verified on iPhone 17 Pro running iOS 26.5 and an Android API 36 emulator.

## Checks

```sh
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```
