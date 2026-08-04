# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

The app is used by people who need to browse a small remote team directory, inspect a teammate, and submit a new teammate. Hiring reviewers also need to install, run, and inspect the submission on iOS and Android.

## Product Purpose

Build a complete, maintainable React Native take-home application that demonstrates practical navigation, networking, list, form, and async-state handling. Success means the documented project runs end to end on both an iOS Simulator and an Android Emulator and the candidate can explain every decision.

## Positioning

This is a deliberately small production-style mobile application, not a feature-rich directory product or an architecture demonstration.

## Operating Context

The candidate builds and debugs locally with React Native CLI, Xcode/iOS Simulator, and Android command-line tools/Android Emulator. Reviewers install the project from source and exercise the list, detail, and add-teammate flows against ReqRes.

## Capabilities and Constraints

- React Native CLI, TypeScript, and npm.
- Native stack navigation between list, detail, and add-teammate screens.
- ReqRes `/api/users` endpoints; current ReqRes requests require an `x-api-key`.
- The API key must not be committed. Client-side configuration prevents repository leakage but is not a secure secret store.
- The app must run on iOS and Android.
- Authentication, backend/proxy code, push notifications, deep linking, and pixel-perfect reference matching are out of scope.

## Evidence on Hand

- `CHALLENGE.md` contains the challenge requirements, response shape, scoring criteria, and documented out-of-scope work.
- No starter implementation, product assets, or reference UI is provided.

## Product Principles

- Complete required flows before optional polish.
- Prefer clear, familiar native behavior over custom interaction.
- Add files, abstractions, and dependencies only when a current requirement uses them.
- Keep data flow and failure states easy to locate and explain.
- Preserve platform accessibility and navigation conventions.

## Accessibility & Inclusion

Use safe areas, visible and accessible control labels, platform back behavior, scalable system text, and touch targets appropriate to iOS and Android.
