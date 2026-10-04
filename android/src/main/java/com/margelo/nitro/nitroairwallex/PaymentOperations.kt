package com.margelo.nitro.nitroairwallex

import com.airwallex.android.AirwallexStarter
import com.airwallex.android.core.Airwallex
import com.airwallex.android.view.composables.PaymentElementConfiguration

internal object PaymentOperations {
    suspend fun sheet(
        intent: PaymentIntent,
        options: CheckoutOptions,
    ): CheckoutResult {
        options.validate(intent)
        val host = CheckoutHost.currentActivity()
        val session =
            intent.toNativeSession(
                options.countryCode,
                options.captureMode,
                options.googlePay,
                options.saveCardFor,
                options.showSavedCards == true,
                options.language,
            )
        val configuration = PaymentElementConfiguration.PaymentSheet(appearance = options.appearance?.toNative(host))
        return awaitPaymentResult { listener -> AirwallexStarter.presentEntirePaymentFlow(host, session, configuration, listener) }
    }

    suspend fun setup(
        intent: PaymentIntent,
        options: CardSetupOptions,
    ): CheckoutResult {
        intent.validate(setup = true)
        PaymentPresentation.validate(options.countryCode, options.language, options.appearance)
        val host = CheckoutHost.currentActivity()
        // Zero-amount setup must complete immediately, not leave an authorization awaiting capture.
        val session =
            intent.toNativeSession(
                options.countryCode,
                CaptureMode.AUTOMATIC,
                saveCardFor = options.futureUse,
                language = options.language,
            )
        val configuration = PaymentElementConfiguration.Card(appearance = options.appearance?.toNative(host))
        return awaitPaymentResult { listener -> AirwallexStarter.presentCardPaymentFlow(host, session, configuration, listener) }
    }

    suspend fun savedCard(
        intent: PaymentIntent,
        card: SavedCard,
        options: SavedCardPaymentOptions,
    ): CheckoutResult {
        intent.validate()
        card.validate(requireNotNull(intent.customerId) { "Saved-card payment requires a customer." })
        PaymentPresentation.validate(options.countryCode, options.language)
        val host = CheckoutHost.currentActivity()
        val session = intent.toNativeSession(options.countryCode, options.captureMode, language = options.language)
        val consent = card.toNative()
        val sdk = Airwallex(host)
        return awaitPaymentResult { listener ->
            sdk.checkout(session, checkNotNull(consent.paymentMethod), paymentConsent = consent, listener = listener)
        }
    }

    suspend fun wallet(
        intent: PaymentIntent,
        options: WalletPaymentOptions,
    ): CheckoutResult {
        intent.validate()
        PaymentPresentation.validate(options.countryCode)
        val wallet = requireNotNull(options.googlePay) { "Google Pay configuration is required on Android." }
        wallet.validate()
        val host = CheckoutHost.currentActivity()
        val session = intent.toNativeSession(options.countryCode, options.captureMode, googlePay = wallet)
        val sdk = Airwallex(host)
        return awaitPaymentResult { listener -> sdk.startGooglePay(session, listener) }
    }
}
