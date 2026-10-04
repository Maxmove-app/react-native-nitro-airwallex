package com.margelo.nitro.nitroairwallex

import android.content.Context
import com.airwallex.android.googlepay.PaymentsUtil
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.wallet.IsReadyToPayRequest
import kotlinx.coroutines.tasks.await
import com.airwallex.android.core.GooglePayOptions as NativeGooglePayOptions

// The SDK checks readiness only for a session; this mirrors that check without an intent or foreground Activity.
internal suspend fun WalletOptions.isAvailable(context: Context): Boolean {
    val wallet = googlePay ?: return false
    wallet.validate()
    if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context) != ConnectionResult.SUCCESS) return false
    val request = checkNotNull(PaymentsUtil.isReadyToPayRequest(NativeGooglePayOptions(merchantName = wallet.merchantName), null))
    return PaymentsUtil.createPaymentsClient(context).isReadyToPay(IsReadyToPayRequest.fromJson(request.toString())).await()
}
