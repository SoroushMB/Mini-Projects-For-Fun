import Foundation

struct Config {
    // MARK: - API Configuration
    static let openRouterAPIKey = "YOUR_OPENROUTER_API_KEY_HERE"
    
    // MARK: - App Configuration
    static let appName = "ALL-ACCESS"
    static let appVersion = "1.0.0"
    
    // MARK: - Default Settings
    static let defaultModel = "grok-beta/grok-2-1212"
    static let maxTokens = 2000
    static let temperature = 0.7
    
    // MARK: - UI Configuration
    static let cornerRadius: CGFloat = 8
    static let padding: CGFloat = 20
    static let animationDuration: Double = 0.3
    
    // MARK: - Validation
    static var isAPIKeyConfigured: Bool {
        return !openRouterAPIKey.isEmpty && openRouterAPIKey != "YOUR_OPENROUTER_API_KEY_HERE"
    }
}