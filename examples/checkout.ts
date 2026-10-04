import { Airwallex, type PaymentIntent, type WalletOptions } from "../src";

// The app creates/recovers its order and intent through its authenticated backend before presentation.
export async function pay(intent: PaymentIntent, reconcile: () => Promise<void>) {
  try {
    return await Airwallex.presentPaymentSheet(intent, {
      environment: "sandbox",
      countryCode: "DE",
      captureMode: "manual",
      language: "de",
      appearance: { accentColor: "#145B44" },
    });
  } finally {
    await reconcile();
  }
}

// Check before rendering the wallet row; no order or intent is needed for readiness.
export async function walletRowAvailable(wallet: WalletOptions) {
  return Airwallex.isWalletAvailable(wallet);
}

export async function payFromWalletRow(
  intent: PaymentIntent,
  wallet: WalletOptions,
  reconcile: () => Promise<void>,
) {
  try {
    return await Airwallex.payWithWallet(intent, {
      ...wallet,
      countryCode: "DE",
      captureMode: "manual",
    });
  } finally {
    await reconcile();
  }
}
