const { createRunOncePlugin, withEntitlementsPlist } = require("expo/config-plugins");
const { name, version } = require("../package.json");

/** Apple Pay entitlement merging; Google Pay metadata is already supplied by the Android SDK. */
function withAirwallex(config, { applePayMerchantIdentifiers = [] } = {}) {
  if (
    !Array.isArray(applePayMerchantIdentifiers) ||
    applePayMerchantIdentifiers.some(
      (identifier) => typeof identifier !== "string" || !/^merchant\.[\w.-]+$/.test(identifier),
    )
  )
    throw new Error("applePayMerchantIdentifiers must contain merchant.* identifiers.");
  if (applePayMerchantIdentifiers.length === 0) return config;
  return withEntitlementsPlist(config, (mod) => {
    const key = "com.apple.developer.in-app-payments";
    mod.modResults[key] = [
      ...new Set([...(mod.modResults[key] ?? []), ...applePayMerchantIdentifiers]),
    ];
    return mod;
  });
}
module.exports = createRunOncePlugin(withAirwallex, name, version);
