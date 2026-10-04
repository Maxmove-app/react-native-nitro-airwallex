import Foundation

extension SavedCard {
  func validate(customerId expected: String) throws {
    guard customerId == expected,
      !customerId.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
      !consentId.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
      !paymentMethodId.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
      !brand.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
      last4.range(of: "^[0-9]{4}$", options: .regularExpression) != nil
    else {
      throw CheckoutError.invalidInput(
        "Saved card requires matching customer, consent ID, payment method ID, brand and last4.")
    }
  }
}
