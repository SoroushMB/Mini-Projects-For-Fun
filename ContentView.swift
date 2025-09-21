import SwiftUI

struct ContentView: View {
    @StateObject private var openRouterService = OpenRouterService(apiKey: Config.openRouterAPIKey)
    @State private var selectedModel = "grok-beta/grok-2-1212"
    @State private var descriptionText = ""
    @State private var selectedImage: UIImage?
    @State private var showingImagePicker = false
    @State private var generatedPrompt: AppPrompt?
    @State private var showingResult = false
    @State private var showingAPIKeyAlert = false
    
    let models = OpenRouterService.availableModels
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.2, green: 0.1, blue: 0.3),
                    Color(red: 0.3, green: 0.2, blue: 0.4)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Status bar area
                HStack {
                    Text("2:03")
                        .foregroundColor(.white)
                        .font(.system(size: 14, weight: .medium))
                    
                    Spacer()
                    
                    HStack(spacing: 8) {
                        Image(systemName: "wifi")
                        Image(systemName: "cellularbars")
                        Image(systemName: "key")
                        Image(systemName: "exclamationmark.triangle")
                        Text("59%")
                    }
                    .foregroundColor(.white)
                    .font(.system(size: 12))
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
                
                // Main app container
                VStack(spacing: 0) {
                    // Drag handle
                    RoundedRectangle(cornerRadius: 2)
                        .fill(Color.gray.opacity(0.6))
                        .frame(width: 40, height: 4)
                        .padding(.top, 10)
                    
                    // App icon and title
                    VStack(spacing: 8) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 24))
                            .foregroundColor(.white)
                        
                        Text("ALL-ACCESS")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.top, 20)
                    
                    // Divider
                    Rectangle()
                        .fill(Color.gray.opacity(0.6))
                        .frame(height: 1)
                        .padding(.horizontal, 20)
                        .padding(.top, 20)
                    
                    // Address & Web section
                    HStack(spacing: 40) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("ADDRESS")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.gray)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("IDEA TO JSON")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white)
                                
                                Text("PROMPT GENERATOR")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white)
                            }
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("WEB")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.gray)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("INTERNET DEV")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white)
                                
                                Text("TECH MARKET")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                    
                    // Divider
                    Rectangle()
                        .fill(Color.gray.opacity(0.6))
                        .frame(height: 1)
                        .padding(.horizontal, 20)
                        .padding(.top, 20)
                    
                    // Model selection
                    VStack(alignment: .leading, spacing: 8) {
                        Text("MODEL")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.gray)
                            .padding(.horizontal, 20)
                        
                        Menu {
                            ForEach(models, id: \.self) { model in
                                Button(OpenRouterService.getModelDisplayName(for: model)) {
                                    selectedModel = model
                                }
                            }
                        } label: {
                            HStack {
                                Text(OpenRouterService.getModelDisplayName(for: selectedModel))
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white)
                                
                                Spacer()
                                
                                Image(systemName: "chevron.down")
                                    .font(.system(size: 12))
                                    .foregroundColor(.white)
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            .background(Color.gray.opacity(0.3))
                            .cornerRadius(8)
                        }
                        .padding(.horizontal, 20)
                    }
                    .padding(.top, 20)
                    
                    // Reference image upload
                    VStack(alignment: .leading, spacing: 8) {
                        Text("REFERENCE IMAGE")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.gray)
                            .padding(.horizontal, 20)
                        
                        Button(action: {
                            showingImagePicker = true
                        }) {
                            VStack(spacing: 12) {
                                Image(systemName: "square.and.arrow.up")
                                    .font(.system(size: 24))
                                    .foregroundColor(.white)
                                
                                Text("UPLOAD IMAGE")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 120)
                            .background(Color.gray.opacity(0.3))
                            .cornerRadius(8)
                        }
                        .padding(.horizontal, 20)
                    }
                    .padding(.top, 20)
                    
                    // Description text area
                    VStack(alignment: .leading, spacing: 8) {
                        Text("DESCRIPTION")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.gray)
                            .padding(.horizontal, 20)
                        
                        TextEditor(text: $descriptionText)
                            .font(.system(size: 14, family: .monospaced))
                            .foregroundColor(.white)
                            .background(Color.gray.opacity(0.3))
                            .cornerRadius(8)
                            .frame(height: 100)
                            .overlay(
                                Group {
                                    if descriptionText.isEmpty {
                                        VStack {
                                            HStack {
                                                Text("Describe your idea...")
                                                    .font(.system(size: 14, family: .monospaced))
                                                    .foregroundColor(.gray)
                                                    .padding(.leading, 8)
                                                    .padding(.top, 8)
                                                Spacer()
                                            }
                                            Spacer()
                                        }
                                    }
                                }
                            )
                            .padding(.horizontal, 20)
                    }
                    .padding(.top, 20)
                    
                    Spacer()
                    
                    // Generate prompt button
                    Button(action: {
                        if !Config.isAPIKeyConfigured {
                            showingAPIKeyAlert = true
                        } else {
                            generatePrompt()
                        }
                    }) {
                        HStack {
                            if openRouterService.isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                    .scaleEffect(0.8)
                            }
                            
                            Text(openRouterService.isLoading ? "GENERATING..." : "GENERATE PROMPT")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(Color.gray.opacity(0.4))
                        .cornerRadius(8)
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                    .disabled(openRouterService.isLoading || descriptionText.isEmpty)
                    .opacity((openRouterService.isLoading || descriptionText.isEmpty) ? 0.6 : 1.0)
                }
                .background(Color.gray.opacity(0.1))
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
                .padding(.horizontal, 20)
                .padding(.top, 20)
                
                Spacer()
                
                // Browser bar
                HStack {
                    Image(systemName: "house")
                        .foregroundColor(.white)
                        .font(.system(size: 16))
                    
                    Spacer()
                    
                    HStack {
                        Image(systemName: "lock")
                            .font(.system(size: 12))
                        Text("jsony.vercel.app")
                            .font(.system(size: 12))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.gray.opacity(0.3))
                    .cornerRadius(12)
                    
                    Spacer()
                    
                    HStack(spacing: 12) {
                        HStack {
                            Image(systemName: "square")
                            Text("69")
                        }
                        .foregroundColor(.white)
                        .font(.system(size: 12))
                        
                        Image(systemName: "ellipsis")
                            .foregroundColor(.white)
                            .font(.system(size: 16))
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 10)
            }
        }
        .sheet(isPresented: $showingImagePicker) {
            ImagePicker(selectedImage: $selectedImage)
        }
        .sheet(isPresented: $showingResult) {
            if let prompt = generatedPrompt {
                ResultView(generatedPrompt: prompt)
            }
        }
        .alert("API Key Required", isPresented: $showingAPIKeyAlert) {
            Button("OK") { }
        } message: {
            Text("Please configure your OpenRouter API key in Config.swift to use this app.")
        }
        .alert("Error", isPresented: .constant(openRouterService.errorMessage != nil)) {
            Button("OK") {
                openRouterService.errorMessage = nil
            }
        } message: {
            Text(openRouterService.errorMessage ?? "")
        }
    }
    
    private func generatePrompt() {
        openRouterService.generateJSONPrompt(
            idea: descriptionText,
            model: selectedModel,
            referenceImage: selectedImage
        ) { result in
            switch result {
            case .success(let prompt):
                generatedPrompt = prompt
                showingResult = true
            case .failure(let error):
                print("Error generating prompt: \(error)")
            }
        }
    }
}

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var selectedImage: UIImage?
    @Environment(\.presentationMode) var presentationMode
    
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        picker.sourceType = .photoLibrary
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }
        
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.selectedImage = image
            }
            parent.presentationMode.wrappedValue.dismiss()
        }
        
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
}

struct ResultView: View {
    let generatedPrompt: AppPrompt
    @Environment(\.presentationMode) var presentationMode
    @State private var showingJSON = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // App Overview
                    VStack(alignment: .leading, spacing: 12) {
                        Text("App Overview")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            InfoRow(label: "Type", value: generatedPrompt.app_type.capitalized)
                            InfoRow(label: "Platform", value: generatedPrompt.platform)
                            InfoRow(label: "UI Style", value: generatedPrompt.ui_style.capitalized)
                            InfoRow(label: "Color Scheme", value: generatedPrompt.color_scheme.capitalized)
                            InfoRow(label: "Target Audience", value: generatedPrompt.target_audience)
                        }
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                    
                    // Description
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Description")
                            .font(.headline)
                        
                        Text(generatedPrompt.description)
                            .font(.body)
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                    
                    // Features
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Features")
                            .font(.headline)
                        
                        ForEach(generatedPrompt.features, id: \.self) { feature in
                            HStack {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.green)
                                Text(feature)
                                Spacer()
                            }
                        }
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                    
                    // Technical Requirements
                    if !generatedPrompt.technical_requirements.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Technical Requirements")
                                .font(.headline)
                            
                            ForEach(generatedPrompt.technical_requirements, id: \.self) { requirement in
                                HStack {
                                    Image(systemName: "gear")
                                        .foregroundColor(.blue)
                                    Text(requirement)
                                    Spacer()
                                }
                            }
                        }
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(12)
                    }
                    
                    // User Flow
                    if !generatedPrompt.user_flow.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("User Flow")
                                .font(.headline)
                            
                            ForEach(Array(generatedPrompt.user_flow.enumerated()), id: \.offset) { index, step in
                                HStack {
                                    Text("\(index + 1).")
                                        .fontWeight(.bold)
                                    Text(step)
                                    Spacer()
                                }
                            }
                        }
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(12)
                    }
                    
                    // Screens
                    if !generatedPrompt.screens.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Screens")
                                .font(.headline)
                            
                            ForEach(Array(generatedPrompt.screens.enumerated()), id: \.offset) { index, screen in
                                VStack(alignment: .leading, spacing: 8) {
                                    Text(screen.name)
                                        .font(.subheadline)
                                        .fontWeight(.semibold)
                                    
                                    Text(screen.purpose)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                    
                                    if !screen.elements.isEmpty {
                                        Text("Elements:")
                                            .font(.caption)
                                            .fontWeight(.medium)
                                        
                                        ForEach(screen.elements, id: \.self) { element in
                                            Text("• \(element)")
                                                .font(.caption)
                                                .padding(.leading, 8)
                                        }
                                    }
                                }
                                .padding()
                                .background(Color.gray.opacity(0.05))
                                .cornerRadius(8)
                            }
                        }
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(12)
                    }
                    
                    // JSON View Button
                    Button(action: {
                        showingJSON = true
                    }) {
                        HStack {
                            Image(systemName: "doc.text")
                            Text("View Raw JSON")
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue.opacity(0.2))
                        .cornerRadius(8)
                    }
                }
                .padding()
            }
            .navigationTitle("Generated Prompt")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(trailing: Button("Done") {
                presentationMode.wrappedValue.dismiss()
            })
        }
        .sheet(isPresented: $showingJSON) {
            JSONView(prompt: generatedPrompt)
        }
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label + ":")
                .fontWeight(.medium)
            Text(value)
            Spacer()
        }
    }
}

struct JSONView: View {
    let prompt: AppPrompt
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            ScrollView {
                Text(prettyPrintedJSON)
                    .font(.system(.body, design: .monospaced))
                    .padding()
            }
            .navigationTitle("JSON Prompt")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(trailing: Button("Done") {
                presentationMode.wrappedValue.dismiss()
            })
        }
    }
    
    private var prettyPrintedJSON: String {
        do {
            let jsonData = try JSONEncoder().encode(prompt)
            let jsonObject = try JSONSerialization.jsonObject(with: jsonData, options: [])
            let prettyData = try JSONSerialization.data(withJSONObject: jsonObject, options: [.prettyPrinted])
            return String(data: prettyData, encoding: .utf8) ?? "Error formatting JSON"
        } catch {
            return "Error: \(error.localizedDescription)"
        }
    }
}

#Preview {
    ContentView()
}