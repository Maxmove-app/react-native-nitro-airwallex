import Foundation

extension CheckoutOptions {
  func validate(intent: PaymentIntent) throws {
    try intent.validate()
    try PaymentPresentation.validate(
      countryCode: countryCode, language: language, appearance: appearance)
    if saveCardFor != nil || showSavedCards == true {
      guard intent.customerId != nil else {
        throw CheckoutError.invalidInput("Saving or showing saved cards requires a customer.")
      }
    }
    try applePay?.validate()
  }
}
