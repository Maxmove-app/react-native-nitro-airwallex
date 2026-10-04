// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CheckoutOptions } from "./CheckoutOptions";
// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CardSetupOptions } from "./CardSetupOptions";

/**
 * Styling for Airwallex's sheets. Light and dark mode follow the system.
 * @see {@linkcode CheckoutOptions.appearance}
 * @see {@linkcode CardSetupOptions.appearance}
 */
export interface CheckoutAppearance {
  /** Accent color as `#RRGGBB`. Defaults to Airwallex's accent. */
  accentColor?: string;
}
