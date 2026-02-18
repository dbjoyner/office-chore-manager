import SwiftUI

struct DailyRowView: View {
    let day: DailyWeather

    private var dayName: String {
        let date = Date(timeIntervalSince1970: TimeInterval(day.dt))
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE"
        return formatter.string(from: date)
    }

    var body: some View {
        HStack {
            Text(dayName)
                .frame(width: 100, alignment: .leading)
                .font(.subheadline)

            AsyncImage(url: URL(string: "https://openweathermap.org/img/wn/\(day.icon)@2x.png")) { image in
                image.resizable()
            } placeholder: {
                ProgressView()
            }
            .frame(width: 40, height: 40)

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 4) {
                    Text("H:")
                        .foregroundStyle(.secondary)
                    TemperatureView(fahrenheit: day.tempMax, fontSize: 13)
                }
                HStack(spacing: 4) {
                    Text("L:")
                        .foregroundStyle(.secondary)
                    TemperatureView(fahrenheit: day.tempMin, fontSize: 13)
                }
            }
            .font(.caption)

            Spacer()

            VStack(alignment: .trailing, spacing: 2) {
                Text(day.description.capitalized)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                HStack(spacing: 8) {
                    Label(String(format: "%.0f mph", day.windSpeed), systemImage: "wind")
                    Label(String(format: "%.0f%%", day.pop * 100), systemImage: "drop.fill")
                }
                .font(.caption2)
                .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}
