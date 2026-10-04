import UIKit

enum CheckoutPresenter {
  @MainActor static func current() throws -> UIViewController {
    let activeScenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
      .filter { $0.activationState == .foregroundActive }
    let windows = activeScenes.flatMap(\.windows).filter(\.isKeyWindow)
    guard windows.count == 1, var controller = windows.first?.rootViewController else {
      throw CheckoutError.unavailable("Airwallex checkout requires one foreground key window.")
    }
    while true {
      if let presented = controller.presentedViewController {
        controller = presented
      } else if let nav = controller as? UINavigationController,
        let visible = nav.visibleViewController
      {
        controller = visible
      } else if let tabs = controller as? UITabBarController,
        let selected = tabs.selectedViewController
      {
        controller = selected
      } else {
        break
      }
    }
    guard controller.viewIfLoaded?.window != nil, !controller.isBeingDismissed else {
      throw CheckoutError.unavailable("The current screen cannot present Airwallex checkout.")
    }
    return controller
  }
}
