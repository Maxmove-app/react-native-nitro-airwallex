package com.margelo.nitro.nitroairwallex

import androidx.activity.ComponentActivity
import androidx.lifecycle.Lifecycle
import com.margelo.nitro.NitroModules

internal object CheckoutHost {
    fun currentActivity(): ComponentActivity {
        val context = checkNotNull(NitroModules.applicationContext) { "React Native is not available." }
        val activity = context.currentActivity as? ComponentActivity
        check(
            activity != null && !activity.isFinishing && !activity.isDestroyed &&
                activity.lifecycle.currentState.isAtLeast(Lifecycle.State.RESUMED),
        ) {
            "Airwallex checkout requires a foreground ComponentActivity."
        }
        return activity
    }
}
