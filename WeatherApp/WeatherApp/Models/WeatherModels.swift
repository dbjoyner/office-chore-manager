import Foundation

// MARK: - One Call API 3.0 Response

struct OneCallResponse: Codable {
    let current: CurrentWeather
    let hourly: [HourlyWeather]
    let daily: [DailyWeatherOneCall]
}

struct CurrentWeather: Codable {
    let dt: Int
    let temp: Double
    let feelsLike: Double
    let humidity: Int
    let windSpeed: Double
    let windDeg: Int
    let weather: [WeatherCondition]

    enum CodingKeys: String, CodingKey {
        case dt, temp, humidity, weather
        case feelsLike = "feels_like"
        case windSpeed = "wind_speed"
        case windDeg = "wind_deg"
    }

    var description: String { weather.first?.description ?? "" }
    var icon: String { weather.first?.icon ?? "01d" }
    var tempCelsius: Double { (temp - 32) * 5 / 9 }
    var feelsLikeCelsius: Double { (feelsLike - 32) * 5 / 9 }
}

struct HourlyWeather: Codable, Identifiable {
    let dt: Int
    let temp: Double
    let feelsLike: Double
    let windSpeed: Double
    let windGust: Double?
    let pop: Double
    let weather: [WeatherCondition]

    var id: Int { dt }

    enum CodingKeys: String, CodingKey {
        case dt, temp, pop, weather
        case feelsLike = "feels_like"
        case windSpeed = "wind_speed"
        case windGust = "wind_gust"
    }

    var description: String { weather.first?.description ?? "" }
    var icon: String { weather.first?.icon ?? "01d" }
    var tempCelsius: Double { (temp - 32) * 5 / 9 }
}

struct DailyWeatherOneCall: Codable {
    let dt: Int
    let temp: DailyTemp
    let weather: [WeatherCondition]
    let windSpeed: Double
    let pop: Double

    enum CodingKeys: String, CodingKey {
        case dt, temp, weather, pop
        case windSpeed = "wind_speed"
    }
}

struct DailyTemp: Codable {
    let min: Double
    let max: Double
}

struct WeatherCondition: Codable {
    let id: Int
    let main: String
    let description: String
    let icon: String
}

// MARK: - Daily Forecast 16 Day API Response

struct DailyForecastResponse: Codable {
    let list: [DailyForecastItem]
}

struct DailyForecastItem: Codable {
    let dt: Int
    let temp: DailyForecastTemp
    let weather: [WeatherCondition]
    let speed: Double
    let pop: Double?

    var popValue: Double { pop ?? 0 }
}

struct DailyForecastTemp: Codable {
    let min: Double
    let max: Double
}

// MARK: - Unified Daily Weather (used in UI)

struct DailyWeather: Identifiable {
    let dt: Int
    let tempMin: Double
    let tempMax: Double
    let description: String
    let icon: String
    let windSpeed: Double
    let pop: Double

    var id: Int { dt }
    var tempMinCelsius: Double { (tempMin - 32) * 5 / 9 }
    var tempMaxCelsius: Double { (tempMax - 32) * 5 / 9 }

    init(from oneCall: DailyWeatherOneCall) {
        self.dt = oneCall.dt
        self.tempMin = oneCall.temp.min
        self.tempMax = oneCall.temp.max
        self.description = oneCall.weather.first?.description ?? ""
        self.icon = oneCall.weather.first?.icon ?? "01d"
        self.windSpeed = oneCall.windSpeed
        self.pop = oneCall.pop
    }

    init(from forecast: DailyForecastItem) {
        self.dt = forecast.dt
        self.tempMin = forecast.temp.min
        self.tempMax = forecast.temp.max
        self.description = forecast.weather.first?.description ?? ""
        self.icon = forecast.weather.first?.icon ?? "01d"
        self.windSpeed = forecast.speed
        self.pop = forecast.popValue
    }
}

// MARK: - Geocoding API Response

struct GeocodingResult: Codable {
    let name: String
    let lat: Double
    let lon: Double
    let country: String
    let state: String?
}
