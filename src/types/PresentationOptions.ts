import type { Environment } from "./Environment";
// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CheckoutOptions } from "./CheckoutOptions";

/**
 * Settings shared by the payment methods that show Airwallex UI.
 * @see {@linkcode CheckoutOptions}
 */
export interface PresentationOptions {
  /** Airwallex environment of the intent. */
  environment: Environment;
  /** Merchant country as uppercase ISO 3166-1 alpha-2, for example `DE`. */
  countryCode: string;
  /** SDK UI language such as `en` or `de`. Defaults to the device language. */
  language?: string;
}
