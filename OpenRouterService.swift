import Foundation
import UIKit

// MARK: - OpenRouter API Models
struct OpenRouterRequest: Codable {
    let model: String
    let messages: [Message]
    let max_tokens: Int?
    let temperature: Double?
    let top_p: Double?
    let frequency_penalty: Double?
    let presence_penalty: Double?
}

struct Message: Codable {
    let role: String
    let content: String
}

struct OpenRouterResponse: Codable {
    let id: String
    let object: String
    let created: Int
    let model: String
    let choices: [Choice]
    let usage: Usage?
}

struct Choice: Codable {
    let index: Int
    let message: Message
    let finish_reason: String?
}

struct Usage: Codable {
    let prompt_tokens: Int
    let completion_tokens: Int
    let total_tokens: Int
}

// MARK: - JSON Prompt Models
struct AppPrompt: Codable {
    let app_type: String
    let platform: String
    let features: [String]
    let ui_style: String
    let color_scheme: String
    let target_audience: String
    let description: String
    let reference_image_description: String?
    let technical_requirements: [String]
    let user_flow: [String]
    let screens: [ScreenDescription]
}

struct ScreenDescription: Codable {
    let name: String
    let purpose: String
    let elements: [String]
    let layout: String
}

// MARK: - OpenRouter Service
class OpenRouterService: ObservableObject {
    private let apiKey: String
    private let baseURL = "https://openrouter.ai/api/v1"
    
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    init(apiKey: String) {
        self.apiKey = apiKey
    }
    
    func generateJSONPrompt(
        idea: String,
        model: String,
        referenceImage: UIImage? = nil,
        completion: @escaping (Result<AppPrompt, Error>) -> Void
    ) {
        isLoading = true
        errorMessage = nil
        
        // Create the prompt for idea to JSON conversion
        let systemPrompt = """
        You are an expert app developer and UX designer. Your task is to convert a user's app idea into a comprehensive JSON prompt that another LLM can use to generate a complete mobile or web application.
        
        The JSON should include:
        - app_type: "mobile" or "web"
        - platform: "iOS", "Android", "React Native", "Web", etc.
        - features: Array of main features
        - ui_style: "modern", "minimalist", "material", "ios", etc.
        - color_scheme: "dark", "light", "auto"
        - target_audience: Description of who will use this app
        - description: Detailed description of the app
        - reference_image_description: Description of any reference image provided
        - technical_requirements: Array of technical needs
        - user_flow: Array describing the main user journey
        - screens: Array of screen descriptions with name, purpose, elements, and layout
        
        Return ONLY valid JSON, no additional text or markdown formatting.
        """
        
        var userPrompt = "Convert this app idea into a comprehensive JSON prompt: \(idea)"
        
        if let image = referenceImage {
            // For now, we'll add a placeholder for image analysis
            // In a real implementation, you'd use vision models or image analysis APIs
            userPrompt += "\n\nReference image provided (describe the visual style and elements you see)."
        }
        
        let messages = [
            Message(role: "system", content: systemPrompt),
            Message(role: "user", content: userPrompt)
        ]
        
        let request = OpenRouterRequest(
            model: model,
            messages: messages,
            max_tokens: 2000,
            temperature: 0.7,
            top_p: 0.9,
            frequency_penalty: 0.0,
            presence_penalty: 0.0
        )
        
        makeAPICall(request: request) { result in
            DispatchQueue.main.async {
                self.isLoading = false
                
                switch result {
                case .success(let response):
                    if let choice = response.choices.first {
                        do {
                            let jsonData = choice.message.content.data(using: .utf8) ?? Data()
                            let appPrompt = try JSONDecoder().decode(AppPrompt.self, from: jsonData)
                            completion(.success(appPrompt))
                        } catch {
                            self.errorMessage = "Failed to parse JSON response: \(error.localizedDescription)"
                            completion(.failure(error))
                        }
                    } else {
                        self.errorMessage = "No response from API"
                        completion(.failure(OpenRouterError.noResponse))
                    }
                case .failure(let error):
                    self.errorMessage = error.localizedDescription
                    completion(.failure(error))
                }
            }
        }
    }
    
    private func makeAPICall(request: OpenRouterRequest, completion: @escaping (Result<OpenRouterResponse, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/chat/completions") else {
            completion(.failure(OpenRouterError.invalidURL))
            return
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("AllAccessApp/1.0", forHTTPHeaderField: "HTTP-Referer")
        
        do {
            urlRequest.httpBody = try JSONEncoder().encode(request)
        } catch {
            completion(.failure(error))
            return
        }
        
        URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(OpenRouterError.noData))
                return
            }
            
            do {
                let response = try JSONDecoder().decode(OpenRouterResponse.self, from: data)
                completion(.success(response))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}

// MARK: - Error Types
enum OpenRouterError: Error, LocalizedError {
    case invalidURL
    case noData
    case noResponse
    case invalidAPIKey
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid API URL"
        case .noData:
            return "No data received from API"
        case .noResponse:
            return "No response from API"
        case .invalidAPIKey:
            return "Invalid API key"
        }
    }
}

// MARK: - Model Configuration
extension OpenRouterService {
    static let availableModels = [
        "grok-beta/grok-2-1212",
        "openai/gpt-4-turbo-preview",
        "openai/gpt-4",
        "anthropic/claude-3-opus",
        "anthropic/claude-3-sonnet",
        "google/gemini-pro-1.5",
        "meta-llama/llama-2-70b-chat",
        "mistralai/mistral-7b-instruct"
    ]
    
    static func getModelDisplayName(for model: String) -> String {
        switch model {
        case "grok-beta/grok-2-1212":
            return "GROK (xAI)"
        case "openai/gpt-4-turbo-preview":
            return "GPT-4 Turbo"
        case "openai/gpt-4":
            return "GPT-4"
        case "anthropic/claude-3-opus":
            return "Claude 3 Opus"
        case "anthropic/claude-3-sonnet":
            return "Claude 3 Sonnet"
        case "google/gemini-pro-1.5":
            return "Gemini Pro 1.5"
        case "meta-llama/llama-2-70b-chat":
            return "Llama 2 70B"
        case "mistralai/mistral-7b-instruct":
            return "Mistral 7B"
        default:
            return model
        }
    }
}