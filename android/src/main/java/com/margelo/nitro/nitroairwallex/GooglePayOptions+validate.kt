package com.margelo.nitro.nitroairwallex

internal fun GooglePayOptions.validate() {
    require(merchantName.isNotBlank()) { "Google Pay requires merchantName." }
}
