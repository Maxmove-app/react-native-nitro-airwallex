import Airwallex

extension PaymentIntent {
  func toNativeSession(
    countryCode: String, captureMode: CaptureMode, applePay: ApplePayOptions? = nil,
    saveCardFor: CardFutureUse? = nil, showSavedCards: Bool = false, language: String? = nil
  ) -> Session {
    return Session(
      paymentIntent: toNative(), countryCode: countryCode,
      applePayOptions: applePay?.toNative(), autoCapture: captureMode == .automatic,
      autoSaveCardForFuturePayments: false, hidePaymentConsents: !showSavedCards,
      lang: language, paymentMethods: applePay == nil ? ["card"] : ["card", "applepay"],
      paymentConsentOptions: saveCardFor?.toNative(), requiredBillingContactFields: .name)
  }
}
