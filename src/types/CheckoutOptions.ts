// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { AirwallexPayments } from "../specs/AirwallexPayments.nitro";
import type { PresentationOptions } from "./PresentationOptions";
import type { CaptureMode } from "./CaptureMode";
import type { ApplePayOptions } from "./ApplePayOptions";
import type { GooglePayOptions } from "./GooglePayOptions";
import type { CardFutureUse } from "./CardFutureUse";
import type { CheckoutAppearance } from "./CheckoutAppearance";

/** Options for {@linkcode AirwallexPayments.presentPaymentSheet}. */
export interface CheckoutOptions extends PresentationOptions {
  /** Capture immediately or only authorize. */
  captureMode: CaptureMode;
  /** Styling for the payment sheet. */
  appearance?: CheckoutAppearance;
  /** Offers Apple Pay in the sheet on iOS. */
  applePay?: ApplePayOptions;
  /** Offers Google Pay in the sheet on Android. */
  googlePay?: GooglePayOptions;
  /** Saves the card under this agreement. Set only after the shopper agreed; requires `intent.customerId`. */
  saveCardFor?: CardFutureUse;
  /** Shows the customer's verified saved cards in the sheet. Requires `intent.customerId`. @default false */
  showSavedCards?: boolean;
}
