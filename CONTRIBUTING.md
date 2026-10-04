# Contributing

Use Bun 1.4.2 and Node 26.7.0. Android needs Java 17 or newer, Android SDK 36 and NDK 27.1.12297006; set `ANDROID_HOME`. iOS needs Xcode and CocoaPods.

```sh
bun install --frozen-lockfile
bun run codegen
bun run check
bun run package:check
bun run test:android
bun run example:prepare
```

Change TypeScript Nitro specs and regenerate bindings; never hand-edit `nitrogen/generated`. Include generated changes in your PR. Keep SDK versions pinned and native code changes focused. Do not add credentials, raw-card APIs, backend networking or timers that release the payment lock while confirmation can still be running.

The checked-in example is generated from the React Native 0.86 template. It installs the tarball built by `example:prepare`, so its native builds exercise the publishable artifact. Sandbox tests require your own server-created intents and official Airwallex test cards; never place API keys in the example. UI completion is not settlement evidence.

Describe the problem, behavior change and checks actually run. Distinguish unit tests, native builds, runtime validation and live sandbox outcomes. Mark device/payment paths that were not exercised.
