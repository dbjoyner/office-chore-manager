import Foundation

struct WeatherService {
    private static let baseURL = "https://api.openweathermap.org"

    // MARK: - One Call API 3.0

    static func fetchOneCall(lat: Double, lon: Double) async throws -> OneCallResponse {
        let url = URL(string: "\(baseURL)/data/3.0/onecall?lat=\(lat)&lon=\(lon)&appid=\(Secrets.apiKey)&units=imperial")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(OneCallResponse.self, from: data)
    }

    // MARK: - Daily Forecast 16 Day API (for 10-day forecast)

    static func fetchDailyForecast(lat: Double, lon: Double, days: Int = 10) async throws -> DailyForecastResponse {
        let url = URL(string: "\(baseURL)/data/2.5/forecast/daily?lat=\(lat)&lon=\(lon)&cnt=\(days)&appid=\(Secrets.apiKey)&units=imperial")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(DailyForecastResponse.self, from: data)
    }

    // MARK: - Geocoding API

    static func geocodeCity(query: String) async throws -> GeocodingResult? {
        guard let encoded = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            return nil
        }
        let url = URL(string: "\(baseURL)/geo/1.0/direct?q=\(encoded)&limit=1&appid=\(Secrets.apiKey)")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let results = try JSONDecoder().decode([GeocodingResult].self, from: data)
        return results.first
    }

    // MARK: - Radar Tile URL

    static func radarTileURL(z: Int, x: Int, y: Int) -> URL {
        URL(string: "https://tile.openweathermap.org/map/precipitation_new/\(z)/\(x)/\(y).png?appid=\(Secrets.apiKey)")!
    }
}
