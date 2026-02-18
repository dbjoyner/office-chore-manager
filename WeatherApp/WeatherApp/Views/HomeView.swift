import SwiftUI

struct HomeView: View {
    var viewModel: WeatherViewModel
    var locationManager: LocationManager
    @State private var searchText = ""

    private var currentDateString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, MMMM d, h:mm a"
        return formatter.string(from: Date())
    }

    private func windDirection(degrees: Int) -> String {
        let directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                          "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
        let index = Int((Double(degrees) + 11.25) / 22.5) % 16
        return directions[index]
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Search bar
                    HStack {
                        TextField("Search city...", text: $searchText)
                            .textFieldStyle(.roundedBorder)
                            .onSubmit {
                                Task { await viewModel.searchCity(query: searchText) }
                            }
                        Button {
                            Task { await viewModel.searchCity(query: searchText) }
                        } label: {
                            Image(systemName: "magnifyingglass")
                                .padding(8)
                                .background(Color.accentColor)
                                .foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                    }
                    .padding(.horizontal)

                    if viewModel.isLoading {
                        ProgressView("Loading weather...")
                            .padding(.top, 40)
                    } else if let error = viewModel.error {
                        Text(error)
                            .foregroundStyle(.red)
                            .padding()
                    } else if let current = viewModel.current {
                        // City name & date
                        VStack(spacing: 4) {
                            Text(viewModel.locationName.isEmpty ? locationManager.cityName : viewModel.locationName)
                                .font(.title)
                                .fontWeight(.bold)
                            Text(currentDateString)
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }

                        // Weather icon
                        AsyncImage(url: URL(string: "https://openweathermap.org/img/wn/\(current.icon)@4x.png")) { image in
                            image.resizable()
                        } placeholder: {
                            ProgressView()
                        }
                        .frame(width: 120, height: 120)

                        // Large dual temperature
                        TemperatureView(fahrenheit: current.temp, fontSize: 42)

                        Text(current.description.capitalized)
                            .font(.title3)
                            .foregroundStyle(.secondary)

                        // Conditions grid
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                            conditionCard(icon: "thermometer", label: "Feels Like",
                                          value: String(format: "%.0f°F / %.0f°C", current.feelsLike, current.feelsLikeCelsius))
                            conditionCard(icon: "humidity", label: "Humidity",
                                          value: "\(current.humidity)%")
                            conditionCard(icon: "wind", label: "Wind",
                                          value: String(format: "%.0f mph %@", current.windSpeed, windDirection(degrees: current.windDeg)))
                        }
                        .padding(.horizontal)
                    } else {
                        Text("No weather data available.\nGrant location access or search for a city.")
                            .multilineTextAlignment(.center)
                            .foregroundStyle(.secondary)
                            .padding(.top, 40)
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("Weather")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private func conditionCard(icon: String, label: String, value: String) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(Color.accentColor)
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
