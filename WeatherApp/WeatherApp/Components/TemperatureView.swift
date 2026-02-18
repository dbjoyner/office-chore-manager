import SwiftUI

struct TemperatureView: View {
    let fahrenheit: Double
    var fontSize: CGFloat = 20

    private var celsius: Double {
        (fahrenheit - 32) * 5 / 9
    }

    var body: some View {
        Text(String(format: "%.0f°F / %.0f°C", fahrenheit, celsius))
            .font(.system(size: fontSize, weight: .medium))
    }
}

#Preview {
    VStack(spacing: 20) {
        TemperatureView(fahrenheit: 72, fontSize: 36)
        TemperatureView(fahrenheit: 32, fontSize: 20)
    }
}
