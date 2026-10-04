package com.margelo.nitro.nitroairwallex

internal object PaymentPresentation {
    fun validate(
        countryCode: String,
        language: String? = null,
        appearance: CheckoutAppearance? = null,
    ) {
        require(countryCode.matches(Regex("[A-Z]{2}"))) { "countryCode must be an uppercase ISO country code." }
        require(language == null || language.isNotBlank()) { "language must not be blank." }
        appearance?.accentColor?.let { require(it.matches(Regex("#[0-9a-fA-F]{6}"))) { "accentColor must use #RRGGBB." } }
    }
}
