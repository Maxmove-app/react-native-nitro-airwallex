// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { AirwallexPayments } from "../specs/AirwallexPayments.nitro";
import type { PresentationOptions } from "./PresentationOptions";
import type { CaptureMode } from "./CaptureMode";

/** Options for {@linkcode AirwallexPayments.payWithSavedCard}. */
export interface SavedCardPaymentOptions extends PresentationOptions {
  /** Capture immediately or only authorize. */
  captureMode: CaptureMode;
}
