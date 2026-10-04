import { Airwallex, type PaymentIntent } from "../src";

/** Any other rejection, such as a held payment lock, fails the check. */
async function rejects(action: () => Promise<unknown>, reason: RegExp) {
  try {
    await action();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (reason.test(message)) return;
    throw new Error(`Unexpected rejection: ${message}`, { cause: error });
  }
  throw new Error("Expected native validation rejection");
}

/** Real RN validation and lock release; none of these invalid inputs may enter payment UI. */
export async function runLifecycleChecks(report: (name: string) => void) {
  const intent: PaymentIntent = {
    id: "fixture",
    clientSecret: "test-only",
    amount: "1.23",
    currency: "EUR",
    customerId: "customer",
  };
  const options = { environment: "sandbox", countryCode: "DE", captureMode: "manual" } as const;
  const zeroOnlyForSetup = /Only card setup accepts zero/;
  await rejects(
    () => Airwallex.presentPaymentSheet({ ...intent, amount: "0" }, options),
    zeroOnlyForSetup,
  );
  await rejects(
    () => Airwallex.presentPaymentSheet({ ...intent, clientSecret: "" }, options),
    /requires id and clientSecret/,
  );
  await rejects(
    () =>
      Airwallex.presentCardSetup(intent, {
        environment: "sandbox",
        countryCode: "DE",
        futureUse: "customer",
      }),
    zeroOnlyForSetup,
  );
  await rejects(
    () =>
      Airwallex.presentCardSetup(
        { ...intent, amount: "0", customerId: undefined },
        { environment: "sandbox", countryCode: "DE", futureUse: "customer" },
      ),
    /Card setup requires a customer/,
  );
  report("payment/setup validation and lease reuse");
  await rejects(
    () =>
      Airwallex.payWithSavedCard(
        intent,
        {
          consentId: "consent",
          customerId: "other",
          paymentMethodId: "method",
          nextTriggeredBy: "customer",
          numberType: "PAN",
          brand: "visa",
          last4: "0005",
        },
        options,
      ),
    /Saved card requires matching customer/,
  );
  report("saved-card customer validation");
  await rejects(() => Airwallex.payWithWallet(intent, options), /configuration is required/);
  if (await Airwallex.isWalletAvailable({ environment: "sandbox" }))
    throw new Error("Unconfigured wallet must be unavailable");
  report("wallet configuration and lease reuse");
}
