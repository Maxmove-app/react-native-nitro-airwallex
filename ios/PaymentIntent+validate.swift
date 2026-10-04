import Foundation

extension PaymentIntent {
  func validate(setup: Bool = false) throws {
    guard !id.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
      !clientSecret.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    else {
      throw CheckoutError.invalidInput("An intent requires id and clientSecret.")
    }
    guard
      amount.range(of: "^(?:0|[1-9][0-9]{0,11})(?:\\.[0-9]{1,3})?$", options: .regularExpression)
        != nil
    else {
      throw CheckoutError.invalidInput(
        "amount must be decimal text with at most 12 integer and 3 fractional digits.")
    }
    let comparison = NSDecimalNumber(string: amount).compare(NSDecimalNumber.zero)
    guard setup ? comparison == .orderedSame : comparison == .orderedDescending else {
      throw CheckoutError.invalidInput(
        "Only card setup accepts zero; payments require a positive amount.")
    }
    guard currency.range(of: "^[A-Z]{3}$", options: .regularExpression) != nil else {
      throw CheckoutError.invalidInput("currency must be an uppercase ISO code.")
    }
    if let customerId, customerId.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      throw CheckoutError.invalidInput("customerId must not be blank.")
    }
    guard !setup || customerId != nil else {
      throw CheckoutError.invalidInput("Card setup requires a customer.")
    }
  }
}
