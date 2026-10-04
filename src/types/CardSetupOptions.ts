// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { AirwallexPayments } from "../specs/AirwallexPayments.nitro";
import type { PresentationOptions } from "./PresentationOptions";
import type { CardFutureUse } from "./CardFutureUse";
import type { CheckoutAppearance } from "./CheckoutAppearance";

/** Options for {@linkcode AirwallexPayments.presentCardSetup}. The intent supplies currency and customer. */
export interface CardSetupOptions extends PresentationOptions {
  /** What the shopper agrees the saved card may be used for. */
  futureUse: CardFutureUse;
  /** Styling for the add-card form. */
  appearance?: CheckoutAppearance;
}
