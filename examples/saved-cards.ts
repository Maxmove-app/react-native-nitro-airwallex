import { Airwallex, type PaymentIntent, type SavedCard, type CheckoutOptions } from "../src";

// Reconciliation retrieves the original setup intent, then verifies its exact payment_consent_id.
// The app's saved-card picker is refreshed from the server after every outcome.
export async function addCard(intent: PaymentIntent, reconcileSetup: () => Promise<void>) {
  try {
    return await Airwallex.presentCardSetup(intent, {
      environment: "sandbox",
      countryCode: "DE",
      futureUse: "customer",
    });
  } finally {
    await reconcileSetup();
  }
}

export async function payAndSave(
  intent: PaymentIntent,
  options: CheckoutOptions,
  reconcile: () => Promise<void>,
) {
  try {
    // Call only after the shopper agrees to saving for later shopper-initiated payments.
    return await Airwallex.presentPaymentSheet(intent, { ...options, saveCardFor: "customer" });
  } finally {
    await reconcile();
  }
}

export async function payWithSelectedCard(
  intent: PaymentIntent,
  card: SavedCard,
  reconcile: () => Promise<void>,
) {
  try {
    return await Airwallex.payWithSavedCard(intent, card, {
      environment: "sandbox",
      countryCode: "DE",
      captureMode: "manual",
    });
  } finally {
    await reconcile();
  }
}
