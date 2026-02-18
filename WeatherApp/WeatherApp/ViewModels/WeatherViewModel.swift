import Foundation
import Observation

@Observable
final class WeatherViewModel {
    var current: CurrentWeather?
    var hourlyForecast: [HourlyWeather] = []
    var dailyForecast: [DailyWeather] = []
    var locationName: String = ""
    var isLoading = false
    var error: String?

    func fetchWeather(lat: Double, lon: Double) async {
        isLoading = true
        error = nil

        do {
            async let oneCallTask = WeatherService.fetchOneCall(lat: lat, lon: lon)
            async let dailyTask = WeatherService.fetchDailyForecast(lat: lat, lon: lon, days: 10)

            let oneCall = try await oneCallTask
            let dailyResponse = try await dailyTask

            current = oneCall.current
            hourlyForecast = Array(oneCall.hourly.prefix(48))
            dailyForecast = dailyResponse.list.map { DailyWeather(from: $0) }
        } catch {
            self.error = error.localizedDescription
        }

        isLoading = false
    }

    func searchCity(query: String) async {
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else { return }

        isLoading = true
        error = nil

        do {
            guard let result = try await WeatherService.geocodeCity(query: query) else {
                error = "City not found"
                isLoading = false
                return
            }
            locationName = result.state != nil ? "\(result.name), \(result.state!)" : result.name
            await fetchWeather(lat: result.lat, lon: result.lon)
        } catch {
            self.error = error.localizedDescription
            isLoading = false
        }
    }
}
