import Airwallex
import UIKit

extension CheckoutAppearance {
  @MainActor func toNative() -> AWXUIContext.Configuration {
    let configuration = AWXUIContext.Configuration()
    if let color = accentColor, let hex = UInt32(color.dropFirst(), radix: 16) {
      configuration.appearance.tintColor = UIColor(
        red: CGFloat((hex >> 16) & 255) / 255,
        green: CGFloat((hex >> 8) & 255) / 255,
        blue: CGFloat(hex & 255) / 255, alpha: 1
      )
    }
    return configuration
  }
}
