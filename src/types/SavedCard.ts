// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { AirwallexPayments } from "../specs/AirwallexPayments.nitro";

/**
 * How Airwallex stores a saved card; metadata only, never a card number. The SDK asks for the CVC
 * when paying with a `PAN` card.
 * @see {@linkcode SavedCard.numberType}
 */
export type CardNumberType = "PAN" | "AIRWALLEX_NETWORK_TOKEN" | "EXTERNAL_NETWORK_TOKEN";

/**
 * Who may start later payments with a saved card.
 * @see {@linkcode SavedCard.nextTriggeredBy}
 */
export type ConsentInitiator = "customer" | "merchant";

/**
 * Safe server projection of a verified Airwallex card consent for
 * {@linkcode AirwallexPayments.payWithSavedCard}. Pass the server's values unchanged; the server
 * must scope consent, customer and intent to the same account and environment.
 */
export interface SavedCard {
  /** Airwallex PaymentConsent ID. */
  consentId: string;
  /** Customer owning the consent; must match the intent's customer. */
  customerId: string;
  /** Airwallex PaymentMethod ID of the card. */
  paymentMethodId: string;
  /** Initiator agreed for later payments. */
  nextTriggeredBy: ConsentInitiator;
  /** Storage reported by Airwallex. Never infer it from the brand. */
  numberType: CardNumberType;
  /** Card brand, for example `visa`. */
  brand: string;
  /** Last four card digits. */
  last4: string;
}
