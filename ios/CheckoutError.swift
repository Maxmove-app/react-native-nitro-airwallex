import Foundation

enum CheckoutError: LocalizedError {
  case invalidInput(String)
  case unavailable(String)
  case paymentFailed

  var errorDescription: String? {
    switch self {
    case .invalidInput(let message), .unavailable(let message): message
    case .paymentFailed: "Airwallex checkout failed. Reconcile the payment on your server."
    }
  }
}
