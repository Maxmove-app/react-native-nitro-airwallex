import NitroModules

final class HybridAirwallexPayments: HybridAirwallexPaymentsSpec {
  func presentPaymentSheet(intent: PaymentIntent, options: CheckoutOptions) throws -> Promise<
    CheckoutResult
  > {
    PaymentOperation.perform(environment: options.environment) {
      try PaymentOperations.sheet(intent: intent, options: options, operation: $0)
    }
  }
  func presentCardSetup(intent: PaymentIntent, options: CardSetupOptions) throws -> Promise<
    CheckoutResult
  > {
    PaymentOperation.perform(environment: options.environment) {
      try PaymentOperations.setup(intent: intent, options: options, operation: $0)
    }
  }
  func payWithSavedCard(intent: PaymentIntent, card: SavedCard, options: SavedCardPaymentOptions)
    throws -> Promise<CheckoutResult>
  {
    PaymentOperation.perform(environment: options.environment) {
      try PaymentOperations.savedCard(intent: intent, card: card, options: options, operation: $0)
    }
  }
  func isWalletAvailable(options: WalletOptions) throws -> Promise<Bool> {
    options.checkAvailability()
  }
  func payWithWallet(intent: PaymentIntent, options: WalletPaymentOptions) throws -> Promise<
    CheckoutResult
  > {
    PaymentOperation.perform(environment: options.environment) {
      try PaymentOperations.wallet(intent: intent, options: options, operation: $0)
    }
  }
}
