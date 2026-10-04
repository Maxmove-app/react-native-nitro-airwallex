import { NitroModules } from "react-native-nitro-modules";
import type { AirwallexPayments } from "./specs/AirwallexPayments.nitro";

/** Airwallex's native payment operations. @see {@linkcode AirwallexPayments} */
export const Airwallex = NitroModules.createHybridObject<AirwallexPayments>("AirwallexPayments");
export type { AirwallexPayments } from "./specs/AirwallexPayments.nitro";
export type { ApplePayOptions } from "./types/ApplePayOptions";
export type { CaptureMode } from "./types/CaptureMode";
export type { CardFutureUse } from "./types/CardFutureUse";
export type { CardSetupOptions } from "./types/CardSetupOptions";
export type { CheckoutAppearance } from "./types/CheckoutAppearance";
export type { CheckoutOptions } from "./types/CheckoutOptions";
export type { CheckoutResult } from "./types/CheckoutResult";
export type { CheckoutStatus } from "./types/CheckoutStatus";
export type { Environment } from "./types/Environment";
export type { GooglePayOptions } from "./types/GooglePayOptions";
export type { PaymentIntent } from "./types/PaymentIntent";
export type { PresentationOptions } from "./types/PresentationOptions";
export type { CardNumberType, ConsentInitiator, SavedCard } from "./types/SavedCard";
export type { SavedCardPaymentOptions } from "./types/SavedCardPaymentOptions";
export type { WalletOptions } from "./types/WalletOptions";
export type { WalletPaymentOptions } from "./types/WalletPaymentOptions";
