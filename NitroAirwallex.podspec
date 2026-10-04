require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'NitroAirwallex'
  s.version = package['version']
  s.summary = package['description']
  s.homepage = 'https://github.com/Maxmove-app/react-native-nitro-airwallex'
  s.license = { :type => package['license'], :file => 'LICENSE' }
  s.authors = package['author']
  s.source = { :git => 'https://github.com/Maxmove-app/react-native-nitro-airwallex.git', :tag => "v#{s.version}" }
  s.platforms = { :ios => '15.1' }
  s.swift_version = '5.10'
  s.source_files = 'ios/**/*.swift'
  load File.join(__dir__, 'nitrogen/generated/ios/NitroAirwallex+autolinking.rb')
  add_nitrogen_files(s)
  s.dependency 'Airwallex/AirwallexPaymentSheet', '6.7.0'
  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  install_modules_dependencies(s)
end
