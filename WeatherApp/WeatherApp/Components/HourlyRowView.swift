import SwiftUI

struct HourlyRowView: View {
    let hour: HourlyWeather

    private var timeString: String {
        let date = Date(timeIntervalSince1970: TimeInterval(hour.dt))
        let formatter = DateFormatter()
        formatter.dateFormat = "h a"
        return formatter.string(from: date)
    }

    var body: some View {
        HStack {
            Text(timeString)
                .frame(width: 60, alignment: .leading)
                .font(.subheadline)

            AsyncImage(url: URL(string: "https://openweathermap.org/img/wn/\(hour.icon)@2x.png")) { image in
                image.resizable()
            } placeholder: {
                ProgressView()
            }
            .frame(width: 40, height: 40)

            TemperatureView(fahrenheit: hour.temp, fontSize: 15)

            Spacer()

            VStack(alignment: .trailing, spacing: 2) {
                Text(hour.description.capitalized)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                HStack(spacing: 8) {
                    Label(String(format: "%.0f mph", hour.windSpeed), systemImage: "wind")
                    Label(String(format: "%.0f%%", hour.pop * 100), systemImage: "drop.fill")
                }
                .font(.caption2)
                .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}
