// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CardSetupOptions } from "./CardSetupOptions";
// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CheckoutOptions } from "./CheckoutOptions";

/**
 * What the shopper agrees a saved card may be used for. `customer`: the shopper starts later
 * payments in the app. `merchant-unscheduled`: the server may charge the card later without the
 * shopper present. Scheduled plans are not exposed.
 * @see {@linkcode CardSetupOptions.futureUse}
 * @see {@linkcode CheckoutOptions.saveCardFor}
 */
export type CardFutureUse = "customer" | "merchant-unscheduled";
