package com.margelo.nitro.nitroairwallex

import android.app.Application
import com.airwallex.android.AirwallexStarter
import com.airwallex.android.card.CardComponent
import com.airwallex.android.core.AirwallexConfiguration
import com.airwallex.android.googlepay.GooglePayComponent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import com.airwallex.android.core.Environment as NativeEnvironment

// The SDK environment, token and theme are process-global. All access belongs to Main.
internal object PaymentRuntime {
    val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var active = false
    private var environment: Environment? = null

    /** Configures the SDK once per process. Wallet readiness needs the environment, not exclusive UI ownership. */
    fun configure(requestedEnvironment: Environment): Application {
        val application =
            checkNotNull(AirwallexStartupProvider.application) {
                "Airwallex startup provider is missing from the application manifest."
            }
        val configured = environment
        if (configured != null) {
            check(configured == requestedEnvironment) { "Airwallex environment cannot change during this app process." }
            return application
        }
        val nativeEnvironment =
            if (requestedEnvironment == Environment.SANDBOX) {
                NativeEnvironment.PREVIEW
            } else {
                NativeEnvironment.PRODUCTION
            }
        AirwallexStarter.initialize(
            application,
            AirwallexConfiguration
                .Builder()
                .setEnvironment(nativeEnvironment)
                .enableLogging(false)
                .saveLogToLocal(false)
                .disableAnalytics()
                .setSupportComponentProviders(listOf(CardComponent.PROVIDER, GooglePayComponent.PROVIDER))
                .build(),
        )
        environment = requestedEnvironment
        return application
    }

    /** Owns the SDK for one payment until its terminal callback. */
    suspend fun <T> run(
        requestedEnvironment: Environment,
        operation: suspend () -> T,
    ): T {
        check(!active) { "Another Airwallex operation is active." }
        configure(requestedEnvironment)
        active = true
        try {
            return operation()
        } finally {
            active = false
        }
    }
}
