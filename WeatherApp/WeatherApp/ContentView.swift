import SwiftUI

struct ContentView: View {
    var viewModel: WeatherViewModel
    var locationManager: LocationManager

    var body: some View {
        TabView {
            HomeView(viewModel: viewModel, locationManager: locationManager)
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }

            HourlyView(viewModel: viewModel)
                .tabItem {
                    Label("Hourly", systemImage: "clock.fill")
                }

            DailyView(viewModel: viewModel)
                .tabItem {
                    Label("Daily", systemImage: "calendar")
                }

            RadarView(locationManager: locationManager)
                .tabItem {
                    Label("Radar", systemImage: "map.fill")
                }
        }
    }
}
