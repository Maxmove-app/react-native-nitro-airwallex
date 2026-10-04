package com.margelo.nitro.nitroairwallex

internal fun CheckoutOptions.validate(intent: PaymentIntent) {
    intent.validate()
    PaymentPresentation.validate(countryCode, language, appearance)
    require((saveCardFor == null && showSavedCards != true) || intent.customerId != null) {
        "Saving or showing saved cards requires a customer."
    }
    googlePay?.validate()
}
