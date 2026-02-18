import SwiftUI

@main
struct WeatherAppApp: App {
    @State private var viewModel = WeatherViewModel()
    @State private var locationManager = LocationManager()

    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: viewModel, locationManager: locationManager)
                .onAppear {
                    locationManager.requestPermission()
                }
                .task(id: locationManager.locationTimestamp) {
                    guard let location = locationManager.currentLocation else { return }
                    viewModel.locationName = locationManager.cityName
                    await viewModel.fetchWeather(lat: location.latitude, lon: location.longitude)
                }
        }
    }
}
