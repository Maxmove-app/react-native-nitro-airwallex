import Airwallex

@MainActor
enum PaymentOperations {
  static func sheet(intent: PaymentIntent, options: CheckoutOptions, operation: PaymentOperation)
    throws
  {
    try options.validate(intent: intent)
    let host = try CheckoutPresenter.current()
    let session = intent.toNativeSession(
      countryCode: options.countryCode, captureMode: options.captureMode,
      applePay: options.applePay, saveCardFor: options.saveCardFor,
      showSavedCards: options.showSavedCards == true, language: options.language)
    let config = options.appearance?.toNative() ?? AWXUIContext.Configuration()
    config.launchStyle = .present
    AWXUIContext.launchPayment(
      from: host, session: session, paymentResultDelegate: operation, configuration: config)
  }

  static func setup(intent: PaymentIntent, options: CardSetupOptions, operation: PaymentOperation)
    throws
  {
    try intent.validate(setup: true)
    try PaymentPresentation.validate(
      countryCode: options.countryCode, language: options.language, appearance: options.appearance)
    // Zero-amount setup must complete immediately, not leave an authorization awaiting capture.
    let session = intent.toNativeSession(
      countryCode: options.countryCode, captureMode: .automatic,
      saveCardFor: options.futureUse, language: options.language)
    let config = options.appearance?.toNative() ?? AWXUIContext.Configuration()
    config.launchStyle = .present
    config.elementType = .addCard
    AWXUIContext.launchPayment(
      from: try CheckoutPresenter.current(), session: session, paymentResultDelegate: operation,
      configuration: config)
  }

  static func savedCard(
    intent: PaymentIntent, card: SavedCard, options: SavedCardPaymentOptions,
    operation: PaymentOperation
  ) throws {
    try intent.validate()
    guard let customer = intent.customerId else {
      throw CheckoutError.invalidInput("Saved-card payment requires a customer.")
    }
    try card.validate(customerId: customer)
    try PaymentPresentation.validate(countryCode: options.countryCode, language: options.language)
    let session = intent.toNativeSession(
      countryCode: options.countryCode, captureMode: options.captureMode, language: options.language
    )
    let handler = PaymentSessionHandler(
      session: session, viewController: try CheckoutPresenter.current(),
      paymentResultDelegate: operation)
    operation.handler = handler
    handler.startConsentPayment(with: card.toNative())
  }

  static func wallet(
    intent: PaymentIntent, options: WalletPaymentOptions, operation: PaymentOperation
  ) throws {
    try intent.validate()
    try PaymentPresentation.validate(countryCode: options.countryCode)
    guard let wallet = options.applePay else {
      throw CheckoutError.invalidInput("Apple Pay configuration is required on iOS.")
    }
    try wallet.validate()
    let session = intent.toNativeSession(
      countryCode: options.countryCode, captureMode: options.captureMode, applePay: wallet)
    let handler = PaymentSessionHandler(
      session: session, viewController: try CheckoutPresenter.current(),
      paymentResultDelegate: operation)
    operation.handler = handler
    handler.startApplePay()
  }
}
