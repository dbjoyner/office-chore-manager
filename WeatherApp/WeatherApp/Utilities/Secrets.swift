import Foundation

enum Secrets {
    static var apiKey: String {
        guard let path = Bundle.main.path(forResource: "Secrets", ofType: "plist"),
              let dict = NSDictionary(contentsOfFile: path),
              let key = dict["OpenWeatherMapAPIKey"] as? String,
              key != "YOUR_API_KEY_HERE" else {
            fatalError("OpenWeatherMap API key not configured. Add your key to Secrets.plist.")
        }
        return key
    }
}
