import Foundation

extension ApplePayOptions {
  func validate() throws {
    guard merchantIdentifier.hasPrefix("merchant."), merchantIdentifier.count > 9,
      !merchantName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    else {
      throw CheckoutError.invalidInput(
        "Apple Pay requires a merchant.* identifier and merchantName.")
    }
  }
}
