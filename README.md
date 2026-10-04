# react-native-nitro-airwallex

Airwallex native payment sheets, saved cards and wallets for React Native, powered by [Nitro Modules](https://nitro.margelo.com/).

**Experimental alpha.** The API may change. Card payment and setup flows have sandbox coverage; physical-device wallet payments and interruption recovery still need broader validation. Read the [validation record and limitations](docs/validation.md) before adopting it.

Community-maintained by Maxmove. This package is not an official Airwallex SDK.

## Install

```sh
npm install react-native-nitro-airwallex@alpha react-native-nitro-modules@0.36.1
```

For iOS, install pods in your application's `ios` directory, then rebuild both native apps. Expo apps need a development build; Expo Go and web are unsupported.

| Dependency | Supported / tested in this alpha |
| --- | --- |
| React Native | 0.86.x, New Architecture / Hermes; tested with 0.86.0 |
| React | 19.2.x |
| Nitro Modules | 0.36.1 |
| Expo plugin | Expo 57; tested with 57.0.8 |
| iOS | Host React Native minimum or higher; Airwallex 6.7.0 |
| Android | Host minimum or API 24, whichever is higher; compile SDK 36, Java 17; Airwallex 6.11.0 |

Older React Native/Expo versions are not advertised until verified. Native autolinking handles registration. Android initializes the SDK's activity-result callbacks before the host Activity is created; there is no JavaScript initialization call.

## Pay with a native sheet

```ts
import { Airwallex, type PaymentIntent } from 'react-native-nitro-airwallex';

// Your authenticated backend creates or recovers the same order and intent.
const intent: PaymentIntent = await backend.createOrRecoverIntent(orderId);
try {
  const result = await Airwallex.presentPaymentSheet(intent, {
    environment: 'sandbox',
    countryCode: 'DE',
    captureMode: 'manual',
  });
  // Display a UI outcome; the backend determines the actual payment state.
} finally {
  await backend.reconcileOrder(orderId);
}
```

`backend` is your application service, not an export of this package. `PaymentIntent` contains `id`, `clientSecret`, `amount` (a decimal string in major units), `currency`, and optional `customerId`. Never embed an Airwallex API key in the app. Pass client secrets directly to native presentation; do not log them or persist them in app state, storage or URLs.

The SDK owns card entry, CVC, 3DS and payment navigation. Raw card numbers and CVC never enter JavaScript through this API.

| Result | Meaning |
| --- | --- |
| `status: 'completed'` | Native SDK success; capture may still be outstanding. |
| `status: 'pending'` | Processing; reconcile with the backend. |
| `status: 'cancelled'` | Native UI cancelled; not proof that a payment is unpaid or void. |
| Rejected promise | Validation, presentation or SDK failure; reconcile the same intent. |
| `consentId?: string` | Optional SDK hint, requiring server verification. |

Keep a durable local order/setup identifier and reconcile after every outcome, foreground/reconnect and process restart. Never create a replacement intent merely because a client response was lost. Only one payment can be active. The environment is fixed by the first operation until the app restarts; do not run another Airwallex integration concurrently.

## Save and reuse a card

```ts
const intent = await backend.createOrRecoverSetup(setupId);
try {
  await Airwallex.presentCardSetup(intent, {
    environment: 'sandbox',
    countryCode: 'DE',
    futureUse: 'customer',
  });
} finally {
  await backend.reconcileSetup(setupId);
}

// The backend returns an authorized, verified SavedCard projection.
await Airwallex.payWithSavedCard(paymentIntent, savedCard, {
  environment: 'sandbox',
  countryCode: 'DE',
  captureMode: 'manual',
});
```

Setup requires a customer-bound zero-amount intent and completes automatically. Obtain the shopper's agreement before setup or pay-and-save. Reconcile saved-card payments in the same `try/finally` pattern as sheet payments.

**Android 6.11.0 omits newly created consent IDs.** Retrieve the original intent on the server and follow its exact `payment_consent_id`. Verify customer, account, environment, status and agreement; never select the customer's newest card as a substitute.

`SavedCard` contains `consentId`, `customerId`, `paymentMethodId`, `nextTriggeredBy`, `numberType`, `brand` and `last4`. Preserve the provider's PAN/network-token classification. The SDK collects PAN-card CVC itself. Network-token and merchant-unscheduled flows remain experimental and are not covered by the recorded sandbox acceptance.

For pay-and-save, set `saveCardFor: 'customer'` or `'merchant-unscheduled'` only after the appropriate agreement. These options require `customerId`. `showSavedCards: true` enables the SDK's saved-card picker. A customer-bound sheet can also offer the SDK's save-card checkbox: unchecked on iOS, pre-checked on Android 6.11.0. Create an intent without a customer when saving must not be offered.

## Apple Pay and Google Pay

```ts
const wallets = {
  environment: 'sandbox' as const,
  applePay: { merchantIdentifier: 'merchant.com.example.app', merchantName: 'Example' },
  googlePay: { merchantName: 'Example' },
};
const available = await Airwallex.isWalletAvailable(wallets);
// After an explicit shopper action and server intent creation:
await Airwallex.payWithWallet(intent, {
  ...wallets,
  countryCode: 'DE',
  captureMode: 'manual',
});
```

Each platform uses its matching configuration. An unconfigured wallet returns `false`; readiness errors reject. Readiness is a device check and does not establish merchant eligibility or payment success. Reconcile wallet outcomes on the backend too. Wallet payments have not yet been accepted on physical devices for this alpha.

The optional Expo plugin merges Apple merchant entitlements:

```json
{
  "expo": {
    "plugins": [
      ["react-native-nitro-airwallex", {
        "applePayMerchantIdentifiers": ["merchant.com.example.app"]
      }]
    ]
  }
}
```

Bare apps configure Apple Pay entitlements themselves. Google Pay metadata comes from the native Airwallex SDK. Merchant registration, provisioning, provider approval and payment-method enablement remain required. Rebuild after capability changes.

## Example and development

The [example app](example/README.md) uses the packed package through normal React Native autolinking. It runs native validation without credentials or payment requests. [TypeScript examples](examples) show backend-owned checkout composition.

```sh
bun install --frozen-lockfile
bun run check
bun run example:prepare
cd example
bun run ios # or bun run android
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for native checks and [release instructions](docs/releasing.md). The library owns native payment presentation only; orders, authorization, idempotency, customer/account binding, capture, refunds, webhooks and settlement belong to your backend.

## License and references

[MIT](LICENSE). Airwallex's separately resolved SDKs have their own [iOS](https://github.com/airwallex/airwallex-payment-ios/blob/6.7.0/LICENSE) and [Android](https://github.com/airwallex/airwallex-payment-android/blob/6.11.0/LICENSE) notices. Provider service terms still apply.

Official documentation: [iOS checkout](https://www.airwallex.com/docs/payments/integration-options/mobile-app-checkout/ios-airwallex-sdk), [Android checkout](https://www.airwallex.com/docs/payments/integration-options/mobile-app-checkout/android-airwallex-sdk), [Nitro Modules](https://nitro.margelo.com/).
