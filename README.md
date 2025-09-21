# ALL-ACCESS App

A SwiftUI application that converts app ideas into comprehensive JSON prompts for LLM-generated mobile and web applications. The app integrates with OpenRouter API to provide access to multiple language models including Grok, GPT-4, Claude, and more.

## Features

- **Dark Theme UI**: Matches the provided design with purple gradient background
- **Multiple LLM Support**: Access to various models through OpenRouter API
- **Image Upload**: Reference image support for visual app ideas
- **Comprehensive JSON Generation**: Converts ideas into detailed app specifications
- **Model Selection**: Choose from different language models
- **Real-time Generation**: Live progress indicators and error handling

## Screenshots

The app features a modern dark UI with:
- Status bar with time and system indicators
- App container with rounded corners and gradient background
- Model selection dropdown
- Reference image upload area
- Description text input
- Generate prompt button with loading states

## Setup Instructions

### 1. Prerequisites

- Xcode 15.0 or later
- iOS 16.0 or later
- OpenRouter API key

### 2. API Key Configuration

1. Get your OpenRouter API key from [OpenRouter](https://openrouter.ai/)
2. Open `Config.swift`
3. Replace `YOUR_OPENROUTER_API_KEY_HERE` with your actual API key:

```swift
static let openRouterAPIKey = "your-actual-api-key-here"
```

### 3. Build and Run

1. Open the project in Xcode
2. Select your target device or simulator
3. Build and run the project (⌘+R)

## Usage

1. **Enter Your Idea**: Describe your app idea in the description field
2. **Select Model**: Choose from available language models (Grok, GPT-4, Claude, etc.)
3. **Upload Reference Image** (Optional): Add a visual reference for your app
4. **Generate Prompt**: Tap "GENERATE PROMPT" to create a comprehensive JSON specification
5. **View Results**: Review the generated app specification with features, technical requirements, user flow, and screen descriptions

## Generated JSON Structure

The app generates a comprehensive JSON prompt containing:

```json
{
  "app_type": "mobile",
  "platform": "iOS",
  "features": ["feature1", "feature2"],
  "ui_style": "modern",
  "color_scheme": "dark",
  "target_audience": "description",
  "description": "detailed app description",
  "reference_image_description": "image analysis",
  "technical_requirements": ["requirement1", "requirement2"],
  "user_flow": ["step1", "step2"],
  "screens": [
    {
      "name": "Screen Name",
      "purpose": "Screen purpose",
      "elements": ["element1", "element2"],
      "layout": "layout description"
    }
  ]
}
```

## Supported Models

- **Grok (xAI)**: `grok-beta/grok-2-1212`
- **GPT-4 Turbo**: `openai/gpt-4-turbo-preview`
- **GPT-4**: `openai/gpt-4`
- **Claude 3 Opus**: `anthropic/claude-3-opus`
- **Claude 3 Sonnet**: `anthropic/claude-3-sonnet`
- **Gemini Pro 1.5**: `google/gemini-pro-1.5`
- **Llama 2 70B**: `meta-llama/llama-2-70b-chat`
- **Mistral 7B**: `mistralai/mistral-7b-instruct`

## Architecture

### Core Components

- **ContentView**: Main UI with dark theme matching the design
- **OpenRouterService**: Handles API communication and JSON generation
- **Config**: Centralized configuration and API key management
- **AppPrompt**: Data models for structured JSON output
- **ResultView**: Displays generated prompts in a user-friendly format

### Key Features

- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during API calls
- **Image Picker**: Native iOS image selection
- **JSON Validation**: Ensures generated JSON is valid and complete
- **Responsive UI**: Adapts to different screen sizes

## Customization

### UI Customization

Modify colors, fonts, and layouts in `ContentView.swift`:

```swift
// Background gradient colors
LinearGradient(
    gradient: Gradient(colors: [
        Color(red: 0.2, green: 0.1, blue: 0.3),  // Top color
        Color(red: 0.3, green: 0.2, blue: 0.4)   // Bottom color
    ]),
    startPoint: .top,
    endPoint: .bottom
)
```

### Model Configuration

Add or modify available models in `OpenRouterService.swift`:

```swift
static let availableModels = [
    "your-model-id",
    // Add more models here
]
```

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your OpenRouter API key is correctly configured
2. **Network Issues**: Check your internet connection
3. **Model Unavailable**: Some models may be temporarily unavailable
4. **JSON Parsing Error**: The generated response may not be valid JSON

### Debug Mode

Enable debug logging by adding print statements in the `generatePrompt()` function.

## License

This project is for educational and development purposes. Please ensure you comply with OpenRouter's terms of service when using their API.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review OpenRouter API documentation
3. Create an issue in the repository