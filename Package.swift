// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AllAccessApp",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "AllAccessApp",
            targets: ["AllAccessApp"]),
    ],
    dependencies: [
        // Add any external dependencies here if needed
        // For example:
        // .package(url: "https://github.com/apple/swift-argument-parser", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "AllAccessApp",
            dependencies: []),
        .testTarget(
            name: "AllAccessAppTests",
            dependencies: ["AllAccessApp"]),
    ]
)