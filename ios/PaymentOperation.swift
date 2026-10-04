import Airwallex
import NitroModules
import UIKit

/// Retains the SDK delegate/handler until terminal completion. Mutable state belongs to UIKit's main thread.
@MainActor
final class PaymentOperation: NSObject, AWXPaymentResultDelegate {
  private static var active: PaymentOperation?
  private static var environment: Environment?
  private var completion: ((Result<CheckoutResult, Error>) -> Void)?
  private var consentId: String?
  var handler: PaymentSessionHandler?

  private init(completion: @escaping (Result<CheckoutResult, Error>) -> Void) {
    self.completion = completion
  }

  nonisolated static func perform(
    environment: Environment, start: @escaping @MainActor (PaymentOperation) throws -> Void
  ) -> Promise<CheckoutResult> {
    // A manual promise is the single bridge from the SDK's delegate API into Nitro.
    let promise = Promise<CheckoutResult>()
    DispatchQueue.main.async {
      guard active == nil else {
        promise.reject(
          withError: CheckoutError.unavailable("Another Airwallex operation is active."))
        return
      }
      guard Self.environment == nil || Self.environment == environment else {
        promise.reject(
          withError: CheckoutError.unavailable(
            "Airwallex environment cannot change during this app process."))
        return
      }
      if Self.environment == nil {
        Airwallex.setMode(environment == .sandbox ? .previewMode : .productionMode)
        Airwallex.disableAnalytics()
        Airwallex.disableLocalLogFile()
        Self.environment = environment
      }
      let operation = PaymentOperation { result in
        switch result {
        case .success(let value): promise.resolve(withResult: value)
        case .failure(let error): promise.reject(withError: error)
        }
      }
      active = operation
      do { try start(operation) } catch { operation.finish(.failure(error)) }
    }
    return promise
  }

  nonisolated func paymentViewController(
    _ controller: UIViewController?, didCompleteWithPaymentConsentId paymentConsentId: String
  ) {
    DispatchQueue.main.async { self.consentId = paymentConsentId }
  }

  nonisolated func paymentViewController(
    _ controller: UIViewController?, didCompleteWith status: AirwallexPaymentStatus, error: Error?
  ) {
    DispatchQueue.main.async { self.complete(status: status, error: error) }
  }

  private func complete(status: AirwallexPaymentStatus, error: Error?) {
    // Hosted SDK delegates run after dismissal; low-level providers own their CVC/wallet/auth UI.
    switch status {
    case .success: finish(.success(CheckoutResult(status: .completed, consentId: consentId)))
    case .inProgress: finish(.success(CheckoutResult(status: .pending, consentId: consentId)))
    case .cancel: finish(.success(CheckoutResult(status: .cancelled, consentId: consentId)))
    case .failure: finish(.failure(error ?? CheckoutError.paymentFailed))
    @unknown default: finish(.failure(CheckoutError.paymentFailed))
    }
  }

  private func finish(_ result: Result<CheckoutResult, Error>) {
    guard let completion else { return }
    self.completion = nil
    handler = nil
    if Self.active === self { Self.active = nil }
    completion(result)
  }
}
