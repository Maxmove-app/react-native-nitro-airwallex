package com.margelo.nitro.nitroairwallex

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
class HybridAirwallexPayments : HybridAirwallexPaymentsSpec() {
    override fun presentPaymentSheet(
        intent: PaymentIntent,
        options: CheckoutOptions,
    ): Promise<CheckoutResult> =
        Promise.async(PaymentRuntime.scope) { PaymentRuntime.run(options.environment) { PaymentOperations.sheet(intent, options) } }

    override fun presentCardSetup(
        intent: PaymentIntent,
        options: CardSetupOptions,
    ): Promise<CheckoutResult> =
        Promise.async(PaymentRuntime.scope) { PaymentRuntime.run(options.environment) { PaymentOperations.setup(intent, options) } }

    override fun payWithSavedCard(
        intent: PaymentIntent,
        card: SavedCard,
        options: SavedCardPaymentOptions,
    ): Promise<CheckoutResult> =
        Promise.async(
            PaymentRuntime.scope,
        ) { PaymentRuntime.run(options.environment) { PaymentOperations.savedCard(intent, card, options) } }

    override fun isWalletAvailable(options: WalletOptions): Promise<Boolean> =
        Promise.async(PaymentRuntime.scope) { options.isAvailable(PaymentRuntime.configure(options.environment)) }

    override fun payWithWallet(
        intent: PaymentIntent,
        options: WalletPaymentOptions,
    ): Promise<CheckoutResult> =
        Promise.async(PaymentRuntime.scope) { PaymentRuntime.run(options.environment) { PaymentOperations.wallet(intent, options) } }
}
