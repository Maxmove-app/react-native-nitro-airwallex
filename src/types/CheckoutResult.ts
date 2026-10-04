// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { AirwallexPayments } from "../specs/AirwallexPayments.nitro";
import type { CheckoutStatus } from "./CheckoutStatus";

/**
 * UI outcome of {@linkcode AirwallexPayments.presentPaymentSheet} and the other payment methods.
 * Reconcile the original intent on the server after every outcome, including rejection.
 */
export interface CheckoutResult {
  /** How Airwallex's UI ended. */
  status: CheckoutStatus;
  /** Consent ID when the SDK reports one. A hint only; verify it on the server. */
  consentId?: string;
}
