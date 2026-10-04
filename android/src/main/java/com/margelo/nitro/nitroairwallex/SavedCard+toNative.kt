package com.margelo.nitro.nitroairwallex

import com.airwallex.android.core.model.PaymentConsent
import com.airwallex.android.core.model.PaymentMethod

internal fun SavedCard.toNative(): PaymentConsent {
    val type =
        when (numberType) {
            CardNumberType.PAN -> PaymentMethod.Card.NumberType.PAN
            CardNumberType.AIRWALLEX_NETWORK_TOKEN -> PaymentMethod.Card.NumberType.AIRWALLEX_NETWORK_TOKEN
            CardNumberType.EXTERNAL_NETWORK_TOKEN -> PaymentMethod.Card.NumberType.EXTERNAL_NETWORK_TOKEN
        }
    val card =
        PaymentMethod.Card
            .Builder()
            .setNumberType(type)
            .setBrand(brand)
            .setLast4(last4)
            .build()
    return PaymentConsent(
        id = consentId,
        customerId = customerId,
        nextTriggeredBy =
            if (nextTriggeredBy ==
                ConsentInitiator.CUSTOMER
            ) {
                PaymentConsent.NextTriggeredBy.CUSTOMER
            } else {
                PaymentConsent.NextTriggeredBy.MERCHANT
            },
        paymentMethod =
            PaymentMethod
                .Builder()
                .setId(paymentMethodId)
                .setType("card")
                .setCard(card)
                .setCustomerId(customerId)
                .build(),
    )
}
