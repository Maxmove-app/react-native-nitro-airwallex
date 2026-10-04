package com.margelo.nitro.nitroairwallex

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertThrows
import org.junit.Test

class CheckoutValidationTest {
    private val intent = PaymentIntent("intent", "test-secret", "12.50", "EUR", "customer")

    @Test fun existingIntentSessionExposesSecretForPaymentSheetLoading() {
        val session = intent.toNativeSession("DE", CaptureMode.MANUAL)
        assertEquals("test-secret", session.clientSecret)
        assertNotNull(session.paymentIntent)
        assertEquals("customer", session.customerId)
        assertEquals("12.50", session.amount.toPlainString())
        assertEquals(false, session.autoCapture)
    }

    @Test fun zeroIsRestrictedToCustomerSetup() {
        intent.validate()
        intent.copy(amount = "0").validate(setup = true)
        assertThrows(IllegalArgumentException::class.java) { intent.validate(setup = true) }
        assertThrows(IllegalArgumentException::class.java) { intent.copy(amount = "0").validate() }
        assertThrows(IllegalArgumentException::class.java) { intent.copy(amount = "0", customerId = null).validate(setup = true) }
    }

    @Test fun invalidMoneyAndCredentialsFailBeforePresentation() {
        listOf("-1", "NaN", "1e2", "01.5", "12,50", " 12.5", "1.2345", "1000000000000").forEach { amount ->
            assertThrows(IllegalArgumentException::class.java) { intent.copy(amount = amount).validate() }
        }
        assertThrows(IllegalArgumentException::class.java) { intent.copy(clientSecret = " ").validate() }
        assertThrows(IllegalArgumentException::class.java) { intent.copy(currency = "eur").validate() }
    }
}
