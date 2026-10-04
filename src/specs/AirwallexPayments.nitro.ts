import type { HybridObject } from "react-native-nitro-modules";
import type { PaymentIntent } from "../types/PaymentIntent";
import type { CheckoutOptions } from "../types/CheckoutOptions";
import type { CardSetupOptions } from "../types/CardSetupOptions";
import type { SavedCardPaymentOptions } from "../types/SavedCardPaymentOptions";
import type { SavedCard } from "../types/SavedCard";
import type { CheckoutResult } from "../types/CheckoutResult";
import type { WalletOptions } from "../types/WalletOptions";
import type { WalletPaymentOptions } from "../types/WalletPaymentOptions";

/**
 * Airwallex's native payment UI. Each payment method presents SDK-owned UI and resolves after it
 * closes. Only one payment may run at a time; a concurrent payment call rejects.
 * @see {@linkcode AirwallexPayments.presentPaymentSheet}
 */
export interface AirwallexPayments extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
  /** Presents Airwallex's payment sheet (card entry, optional saved cards and wallets) for a server-created intent. */
  presentPaymentSheet(intent: PaymentIntent, options: CheckoutOptions): Promise<CheckoutResult>;
  /**
   * Presents Airwallex's add-card form for a zero-amount, customer-bound intent and saves the card.
   * Reconcile on the server: Android 6.11.0 omits the new consent ID; the intent's
   * `payment_consent_id` provides it.
   */
  presentCardSetup(intent: PaymentIntent, options: CardSetupOptions): Promise<CheckoutResult>;
  /** Pays with a card the shopper selected in the app. The SDK collects CVC and 3DS when required. */
  payWithSavedCard(
    intent: PaymentIntent,
    card: SavedCard,
    options: SavedCardPaymentOptions,
  ): Promise<CheckoutResult>;
  /**
   * Whether this device can pay with Apple Pay (iOS) or Google Pay (Android). Needs no intent,
   * never charges and may run during a payment. Resolves `false` when the platform's wallet
   * options are missing. This is not merchant or account approval.
   */
  isWalletAvailable(options: WalletOptions): Promise<boolean>;
  /** Starts Apple Pay (iOS) or Google Pay (Android) directly, for example from the app's wallet row. */
  payWithWallet(intent: PaymentIntent, options: WalletPaymentOptions): Promise<CheckoutResult>;
}
