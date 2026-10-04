// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { AirwallexPayments } from "../specs/AirwallexPayments.nitro";

/**
 * Server-created Airwallex PaymentIntent that every payment method takes, for example
 * {@linkcode AirwallexPayments.presentPaymentSheet}.
 */
export interface PaymentIntent {
  /** Airwallex PaymentIntent ID. */
  id: string;
  /** Short-lived client secret. Never log or persist it in the app. */
  clientSecret: string;
  /** Decimal amount in major units, for example `"12.50"`. Zero only for card setup. */
  amount: string;
  /** Uppercase ISO 4217 currency code. */
  currency: string;
  /** Airwallex customer. Required for card setup, saving cards and saved-card payments. */
  customerId?: string;
}
