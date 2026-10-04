import NitroModules
import PassKit

extension WalletOptions {
  func checkAvailability() -> Promise<Bool> {
    let promise = Promise<Bool>()
    DispatchQueue.main.async {
      do {
        guard let wallet = self.applePay else {
          promise.resolve(withResult: false)
          return
        }
        try wallet.validate()
        let config = wallet.toNative()
        promise.resolve(
          withResult: PKPaymentAuthorizationController.canMakePayments(
            usingNetworks: config.supportedNetworks, capabilities: config.merchantCapabilities))
      } catch { promise.reject(withError: error) }
    }
    return promise
  }
}
