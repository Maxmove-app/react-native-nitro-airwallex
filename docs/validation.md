# Validation and known limitations

## Native SDK acceptance before extraction

The bridge was exercised in React Native 0.86 / Nitro 0.36.1 / Hermes hosts on an iOS 26.5 arm64 simulator and an Android API 37 arm64 emulator with Airwallex iOS 6.7.0 and Android 6.11.0. These were sandbox flows, independently checked through provider reads on a server.

| Flow | iOS | Android |
| --- | --- | --- |
| Full payment sheet, frictionless card | Passed; authorization awaiting capture | Passed; authorization awaiting capture |
| Competing presentation | Rejected; original sheet remained usable | Rejected; original sheet remained usable |
| Explicit close/back | Cancelled | Cancelled |
| Issuer decline | Rejected | Rejected |
| Interactive 3DS success | Passed | Passed |
| Zero-amount card setup | Succeeded; exact consent verified | Succeeded; exact consent verified |
| Saved PAN card with native CVC | Passed | Passed |
| Customer pay-and-save | Passed | Passed |
| Unconfigured wallet readiness | False | False |
| Configured wallet payment | Not tested | Reached Google Pay setup prerequisite; no payment |

No positive-amount capture or refund was performed. These results cover the bridge, not a merchant's full financial lifecycle.

An additional iOS swipe-down test returned `cancelled`, and subsequent lifecycle checks passed. Airwallex 6.7.0's payment controller reports cancellation during cleanup. The bridge keeps the SDK's normal swipe behavior. Earlier source-review speculation that every swipe would hold the payment lock was disproved by that runtime test.

## Alpha release checks

The release checks typechecking, lint/format, generated-binding drift, Expo plugin behavior and Android native unit tests. The example app consumes the packed artifact, including generated native bindings. Native build and runtime results for the extracted package are recorded in its GitHub release notes; do not infer a pass from the pre-extraction table alone.

For `0.1.0-alpha.1`, the extracted package passed on 2026-10-04:

- TypeScript checking, lint, JavaScript/Swift/Kotlin/C++ formatting, all 7 Expo plugin tests and all 5 Android native unit tests.
- Regeneration of all 92 generated binding files with no changes.
- Package-content checks and a Gitleaks scan of the public repository history.
- A normal autolinked Android arm64 debug build and an iOS simulator release build from the packed artifact.
- Hermes runtime checks on Android API 37 and iOS 26.5: invalid payment input rejected and unconfigured wallet readiness returned `false`.
- GitHub CI quality, Android and iOS jobs on the standalone repository.

The extracted example checks do not make payment requests. Live sandbox payment coverage is recorded separately above.

## Open acceptance areas

- Physical-device Apple Pay and Google Pay payments, including merchant provisioning.
- Network-token cards and merchant-unscheduled consent flows.
- 3DS failure/cancellation and prolonged network stalls.
- Background/resume, Android Activity recreation and process/runtime destruction during confirmation.
- Connected-account ownership and consent portability.

The server must recover interrupted operations using durable identifiers. There is deliberately no timer or public close/dispose call that releases the SDK lock while an operation may still confirm.

## SDK constraints

- Android 6.11.0 does not reliably deliver new consent IDs. Follow the original intent's exact consent reference on the backend.
- Android pre-checks the save-card checkbox for customer-bound sheet intents; the pinned SDK has no setting to change that default.
- The SDK environment is process-global and cannot be switched after configuration.
- Airwallex 6.11.0 declares an unused legacy Kotlin Android Extensions runtime. The bridge excludes that dependency on its Airwallex edges while retaining Parcelize, avoiding duplicate classes with newer host Parcelize runtimes. Remove the exclusion when a pinned SDK drops the obsolete dependency.
