// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { AirwallexPayments } from "../specs/AirwallexPayments.nitro";
import type { Environment } from "./Environment";
import type { ApplePayOptions } from "./ApplePayOptions";
import type { GooglePayOptions } from "./GooglePayOptions";

/** Wallet configuration for {@linkcode AirwallexPayments.isWalletAvailable}. Each platform reads its own wallet. */
export interface WalletOptions {
  /** Airwallex environment of the intents this wallet will pay. */
  environment: Environment;
  /** Apple Pay configuration, read on iOS. */
  applePay?: ApplePayOptions;
  /** Google Pay configuration, read on Android. */
  googlePay?: GooglePayOptions;
}
