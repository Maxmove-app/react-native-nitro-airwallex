import { describe, expect, test } from "bun:test";
import { compileModsAsync, withEntitlementsPlist } from "expo/config-plugins";
import withAirwallex from "../app.plugin";

async function evaluate(options, prepare = (config) => config) {
  const config = prepare(
    withAirwallex(
      {
        name: "Airwallex test",
        slug: "airwallex-test",
        ios: { bundleIdentifier: "dev.maxmove.airwallex.test" },
        android: { package: "dev.maxmove.airwallex.test" },
      },
      options,
    ),
  );
  const result = await compileModsAsync(config, {
    projectRoot: import.meta.dir,
    platforms: ["ios", "android"],
    introspect: true,
    ignoreExistingNativeFiles: true,
  });
  return result._internal.modResults;
}

describe("wallet capabilities", () => {
  test("preserves existing Apple Pay merchants and deduplicates requested merchants", async () => {
    const result = await evaluate(
      { applePayMerchantIdentifiers: ["merchant.maxmove", "merchant.maxmove"] },
      (config) =>
        withEntitlementsPlist(config, (mod) => {
          mod.modResults["com.apple.developer.in-app-payments"] = ["merchant.existing"];
          mod.modResults["aps-environment"] = "development";
          return mod;
        }),
    );
    expect(result.ios.entitlements["com.apple.developer.in-app-payments"]).toEqual([
      "merchant.existing",
      "merchant.maxmove",
    ]);
    expect(result.ios.entitlements["aps-environment"]).toBe("development");
  });

  test("does not enable wallets by default", async () => {
    const result = await evaluate(undefined);
    expect(result.ios.entitlements["com.apple.developer.in-app-payments"]).toBeUndefined();
    const metadata = result.android.manifest.manifest.application[0]["meta-data"] ?? [];
    expect(
      metadata.some(
        (item) => item.$["android:name"] === "com.google.android.gms.wallet.api.enabled",
      ),
    ).toBe(false);
  });

  test.each([null, "merchant.maxmove", ["invalid"], ["merchant."], [123]])(
    "rejects invalid merchant identifiers: %p",
    (value) => {
      expect(() =>
        withAirwallex({ name: "test", slug: "test" }, { applePayMerchantIdentifiers: value }),
      ).toThrow("merchant.*");
    },
  );
});
