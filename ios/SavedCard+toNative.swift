import Airwallex

extension SavedCard {
  func toNative() -> AWXPaymentConsent {
    let card = AWXCard()
    card.numberType = numberType.stringValue
    card.brand = brand
    card.last4 = last4
    let method = AWXPaymentMethod()
    method.id = paymentMethodId
    method.type = "card"
    method.customerId = customerId
    method.card = card
    let consent = AWXPaymentConsent()
    consent.id = consentId
    consent.customerId = customerId
    consent.nextTriggeredBy = nextTriggeredBy == .customer ? "customer" : "merchant"
    consent.paymentMethod = method
    return consent
  }
}
