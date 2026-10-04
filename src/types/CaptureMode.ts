// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { CheckoutOptions } from "./CheckoutOptions";

/**
 * When an authorized card payment is captured: `automatic` captures immediately; `manual` only
 * authorizes, and the server captures later.
 * @see {@linkcode CheckoutOptions.captureMode}
 */
export type CaptureMode = "automatic" | "manual";
