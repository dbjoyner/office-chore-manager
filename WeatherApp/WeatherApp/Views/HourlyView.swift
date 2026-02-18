import SwiftUI

struct HourlyView: View {
    var viewModel: WeatherViewModel

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    ProgressView("Loading...")
                } else if viewModel.hourlyForecast.isEmpty {
                    ContentUnavailableView("No Hourly Data",
                                           systemImage: "clock",
                                           description: Text("Hourly forecast will appear once weather data is loaded."))
                } else {
                    List(viewModel.hourlyForecast) { hour in
                        HourlyRowView(hour: hour)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("48-Hour Forecast")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
