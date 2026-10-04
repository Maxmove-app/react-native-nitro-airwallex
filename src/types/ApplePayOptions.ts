// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CheckoutOptions } from "./CheckoutOptions";
// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { WalletOptions } from "./WalletOptions";

/**
 * Apple Pay configuration, read on iOS.
 * @see {@linkcode CheckoutOptions.applePay}
 * @see {@linkcode WalletOptions.applePay}
 */
export interface ApplePayOptions {
  /** Apple merchant identifier (`merchant.*`), also listed in the app's signed entitlements. */
  merchantIdentifier: string;
  /** Merchant name shown beside the total in the Apple Pay sheet. */
  merchantName: string;
}
