package com.margelo.nitro.nitroairwallex

import com.airwallex.android.core.model.PaymentConsent
import com.airwallex.android.core.model.PaymentMethod
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertThrows
import org.junit.Test

class CardWorkflowsTest {
    private val card = SavedCard("consent", "customer", "method", ConsentInitiator.CUSTOMER, CardNumberType.PAN, "visa", "4242")

    @Test fun agreementsKeepMerchantAndCustomerSemanticsDistinct() {
        val customer = CardFutureUse.CUSTOMER.toNative()
        assertEquals(PaymentConsent.NextTriggeredBy.CUSTOMER, customer.nextTriggeredBy)
        assertNull(customer.merchantTriggerReason)
        val merchant = CardFutureUse.MERCHANT_UNSCHEDULED.toNative()
        assertEquals(PaymentConsent.NextTriggeredBy.MERCHANT, merchant.nextTriggeredBy)
        assertEquals(PaymentConsent.MerchantTriggerReason.UNSCHEDULED, merchant.merchantTriggerReason)
    }

    @Test fun savedCardPreservesMetadataNeededForNativeCvc() {
        card.validate("customer")
        val consent = card.toNative()
        assertEquals("consent", consent.id)
        assertEquals("method", consent.paymentMethod?.id)
        assertEquals("customer", consent.customerId)
        assertEquals(PaymentMethod.Card.NumberType.PAN, consent.paymentMethod?.card?.numberType)
        assertNull(consent.paymentMethod?.card?.number)
        assertNull(consent.paymentMethod?.card?.cvc)
        assertEquals(
            PaymentMethod.Card.NumberType.AIRWALLEX_NETWORK_TOKEN,
            card
                .copy(numberType = CardNumberType.AIRWALLEX_NETWORK_TOKEN)
                .toNative()
                .paymentMethod
                ?.card
                ?.numberType,
        )
        assertThrows(IllegalArgumentException::class.java) { card.validate("another-customer") }
        assertThrows(IllegalArgumentException::class.java) { card.copy(last4 = "12345").validate("customer") }
    }
}
