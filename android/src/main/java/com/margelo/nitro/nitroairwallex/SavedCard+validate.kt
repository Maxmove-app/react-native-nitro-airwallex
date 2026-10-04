package com.margelo.nitro.nitroairwallex

internal fun SavedCard.validate(expectedCustomerId: String) {
    require(
        customerId == expectedCustomerId && customerId.isNotBlank() && consentId.isNotBlank() &&
            paymentMethodId.isNotBlank() && brand.isNotBlank() && last4.matches(Regex("[0-9]{4}")),
    ) {
        "Saved card requires matching customer, consent ID, payment method ID, brand and last4."
    }
}
