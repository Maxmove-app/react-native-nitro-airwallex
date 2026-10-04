package com.margelo.nitro.nitroairwallex

import java.math.BigDecimal

internal fun PaymentIntent.validate(setup: Boolean = false) {
    require(id.isNotBlank() && clientSecret.isNotBlank()) { "An intent requires id and clientSecret." }
    require(amount.matches(Regex("(?:0|[1-9][0-9]{0,11})(?:\\.[0-9]{1,3})?"))) {
        "amount must be decimal text with at most 12 integer and 3 fractional digits."
    }
    val sign = BigDecimal(amount).signum()
    require(if (setup) sign == 0 else sign > 0) { "Only card setup accepts zero; payments require a positive amount." }
    require(currency.matches(Regex("[A-Z]{3}"))) { "currency must be an uppercase ISO code." }
    require(customerId == null || customerId.isNotBlank()) { "customerId must not be blank." }
    require(!setup || customerId != null) { "Card setup requires a customer." }
}
