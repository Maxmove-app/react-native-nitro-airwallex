package com.margelo.nitro.nitroairwallex

import android.content.Context
import android.graphics.Color
import com.airwallex.android.core.Appearance

internal fun CheckoutAppearance.toNative(context: Context): Appearance =
    Appearance(
        themeColor =
            accentColor?.let { Color.parseColor(it) }
                ?: androidx.core.content.ContextCompat
                    .getColor(context, com.airwallex.android.ui.R.color.airwallex_tint_color),
    )
