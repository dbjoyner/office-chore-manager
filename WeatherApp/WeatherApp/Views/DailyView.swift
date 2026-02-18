import SwiftUI

struct DailyView: View {
    var viewModel: WeatherViewModel

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    ProgressView("Loading...")
                } else if viewModel.dailyForecast.isEmpty {
                    ContentUnavailableView("No Daily Data",
                                           systemImage: "calendar",
                                           description: Text("Daily forecast will appear once weather data is loaded."))
                } else {
                    List(viewModel.dailyForecast) { day in
                        DailyRowView(day: day)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("10-Day Forecast")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
