import Foundation

enum PaymentPresentation {
  static func validate(
    countryCode: String, language: String? = nil, appearance: CheckoutAppearance? = nil
  ) throws {
    guard countryCode.range(of: "^[A-Z]{2}$", options: .regularExpression) != nil else {
      throw CheckoutError.invalidInput("countryCode must be an uppercase ISO country code.")
    }
    if let language, language.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      throw CheckoutError.invalidInput("language must not be blank.")
    }
    if let color = appearance?.accentColor,
      color.range(of: "^#[0-9a-fA-F]{6}$", options: .regularExpression) == nil
    {
      throw CheckoutError.invalidInput("accentColor must use #RRGGBB.")
    }
  }
}
