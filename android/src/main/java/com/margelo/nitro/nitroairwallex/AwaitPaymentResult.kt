package com.margelo.nitro.nitroairwallex

import com.airwallex.android.core.Airwallex
import com.airwallex.android.core.AirwallexPaymentStatus
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

// SDK callbacks arrive after the hosted flow returns. Keep the process lease until that terminal callback.
internal suspend fun awaitPaymentResult(start: (Airwallex.PaymentResultListener) -> Unit): CheckoutResult =
    suspendCoroutine { continuation ->
        var completed = false
        val listener =
            object : Airwallex.PaymentResultListener {
                override fun onCompleted(status: AirwallexPaymentStatus) {
                    if (completed) return
                    completed = true
                    when (status) {
                        is AirwallexPaymentStatus.Success -> continuation.resume(CheckoutResult(CheckoutStatus.COMPLETED, status.consentId))
                        is AirwallexPaymentStatus.InProgress -> continuation.resume(CheckoutResult(CheckoutStatus.PENDING, null))
                        is AirwallexPaymentStatus.Cancel -> continuation.resume(CheckoutResult(CheckoutStatus.CANCELLED, null))
                        is AirwallexPaymentStatus.Failure -> continuation.resumeWithException(status.exception)
                    }
                }
            }
        try {
            start(listener)
        } catch (error: Throwable) {
            if (!completed) {
                completed = true
                continuation.resumeWithException(error)
            }
        }
    }
