# Nitro Airwallex example

This React Native 0.86 example installs the library's packed tarball, not workspace source. It runs credential-free native checks: invalid payment input must reject and unconfigured wallet readiness must return false. No payment request is sent.

From the repository root:

```sh
bun install --frozen-lockfile
bun run example:prepare
cd example
bun start
```

In another terminal, run `bun run android` or install iOS pods with `pod install` from `example/ios`, then `bun run ios` from `example/`. The release checks use CocoaPods 1.16.2 directly, matching CI.

Press **Run native checks**. A pass verifies that the tarball resolves in Metro, autolinks and executes in Hermes. Re-run `bun run example:prepare` after library changes; it rebuilds/repackages and refreshes the example installation.

For real sandbox UI, adapt the root README's typed checkout examples to your authenticated backend. Keep API keys server-side, use a server-created intent and reconcile the same durable identifier after every native result. Do not replace the invalid fixture with real credentials in committed code.
