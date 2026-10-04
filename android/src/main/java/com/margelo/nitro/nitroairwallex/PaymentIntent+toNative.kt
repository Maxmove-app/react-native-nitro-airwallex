package com.margelo.nitro.nitroairwallex

import java.math.BigDecimal
import com.airwallex.android.core.model.PaymentIntent as NativePaymentIntent

internal fun PaymentIntent.toNative(): NativePaymentIntent =
    NativePaymentIntent(
        id = id,
        amount = BigDecimal(amount),
        currency = currency,
        customerId = customerId,
        clientSecret = clientSecret,
    )
