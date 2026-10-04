import Airwallex
import Foundation

extension PaymentIntent {
  func toNative() -> AWXPaymentIntent {
    let intent = AWXPaymentIntent()
    intent.id = id
    intent.clientSecret = clientSecret
    intent.amount = NSDecimalNumber(string: amount)
    intent.currency = currency
    intent.customerId = customerId
    return intent
  }
}
