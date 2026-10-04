import Airwallex

extension ApplePayOptions {
  func toNative() -> AWXApplePayOptions {
    let options = AWXApplePayOptions(merchantIdentifier: merchantIdentifier)
    options.totalPriceLabel = merchantName
    return options
  }
}
