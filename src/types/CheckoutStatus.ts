// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CheckoutResult } from "./CheckoutResult";

/**
 * How Airwallex's UI ended. `completed`: the SDK reports success; manual capture can still be
 * outstanding. `pending`: the payment is still processing. `cancelled`: the shopper closed the UI,
 * which does not prove the intent is unpaid. Failures reject instead.
 * @see {@linkcode CheckoutResult.status}
 */
export type CheckoutStatus = "completed" | "pending" | "cancelled";
