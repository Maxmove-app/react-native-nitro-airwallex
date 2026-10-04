import Airwallex

extension CardFutureUse {
  func toNative() -> PaymentConsentOptions {
    switch self {
    case .customer: PaymentConsentOptions(nextTriggeredBy: .customerType)
    case .merchantUnscheduled:
      PaymentConsentOptions(nextTriggeredBy: .merchantType, merchantTriggerReason: .unscheduled)
    }
  }
}
