package com.margelo.nitro.nitroairwallex

import com.airwallex.android.core.model.PaymentConsent
import com.airwallex.android.core.model.PaymentConsentOptions

internal fun CardFutureUse.toNative(): PaymentConsentOptions =
    when (this) {
        CardFutureUse.CUSTOMER -> {
            PaymentConsentOptions(PaymentConsent.NextTriggeredBy.CUSTOMER)
        }

        CardFutureUse.MERCHANT_UNSCHEDULED -> {
            PaymentConsentOptions(
                PaymentConsent.NextTriggeredBy.MERCHANT,
                PaymentConsent.MerchantTriggerReason.UNSCHEDULED,
            )
        }
    }
