// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CheckoutOptions } from "./CheckoutOptions";
// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { WalletOptions } from "./WalletOptions";

/**
 * Google Pay configuration, read on Android.
 * @see {@linkcode CheckoutOptions.googlePay}
 * @see {@linkcode WalletOptions.googlePay}
 */
export interface GooglePayOptions {
  /** Merchant name shown in Google Pay. Production use also requires Google's approval. */
  merchantName: string;
}
