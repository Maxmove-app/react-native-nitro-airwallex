package com.margelo.nitro.nitroairwallex

import com.airwallex.android.core.RequiredBillingContactField
import com.airwallex.android.core.Session
import java.util.Locale
import com.airwallex.android.core.GooglePayOptions as NativeGooglePayOptions

internal fun PaymentIntent.toNativeSession(
    countryCode: String,
    captureMode: CaptureMode,
    googlePay: GooglePayOptions? = null,
    saveCardFor: CardFutureUse? = null,
    showSavedCards: Boolean = false,
    language: String? = null,
): Session {
    val wallet = googlePay?.let { NativeGooglePayOptions(merchantName = it.merchantName) }
    return Session
        .Builder(toNative(), countryCode, wallet)
        .setAutoCapture(captureMode == CaptureMode.AUTOMATIC)
        .setHidePaymentConsents(!showSavedCards)
        .setPaymentConsentOptions(saveCardFor?.toNative())
        .setRequiredBillingContactFields(setOf(RequiredBillingContactField.NAME))
        .setPaymentMethods(if (wallet == null) listOf("card") else listOf("card", "googlepay"))
        .setLocale(language?.let { Locale.forLanguageTag(it) })
        .build()
}
