// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { AirwallexPayments } from "../specs/AirwallexPayments.nitro";
import type { WalletOptions } from "./WalletOptions";
import type { CaptureMode } from "./CaptureMode";

/** Options for {@linkcode AirwallexPayments.payWithWallet}; the current platform's wallet options are required. */
export interface WalletPaymentOptions extends WalletOptions {
  /** Merchant country as uppercase ISO 3166-1 alpha-2, for example `DE`. */
  countryCode: string;
  /** Capture immediately or only authorize. */
  captureMode: CaptureMode;
}
