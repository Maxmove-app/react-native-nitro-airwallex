// oxlint-disable-next-line no-unused-vars -- Public JSDoc links need this type in scope.
import type { PresentationOptions } from "./PresentationOptions";

/**
 * Airwallex environment of the server that created the intent. `sandbox` uses
 * `api.sandbox.airwallex.com` and Google Pay's test environment. Fixed for the app process once
 * the SDK is configured.
 * @see {@linkcode PresentationOptions.environment}
 */
export type Environment = "sandbox" | "production";
