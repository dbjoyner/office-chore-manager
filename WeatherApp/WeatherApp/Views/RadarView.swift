import SwiftUI
import MapKit

struct RadarView: View {
    var locationManager: LocationManager

    @State private var position: MapCameraPosition = .automatic

    var body: some View {
        NavigationStack {
            Map(position: $position) {
                if let coord = locationManager.currentLocation {
                    Annotation("My Location", coordinate: coord) {
                        Image(systemName: "location.fill")
                            .foregroundStyle(.blue)
                            .padding(6)
                            .background(.white)
                            .clipShape(Circle())
                            .shadow(radius: 2)
                    }
                }
            }
            .mapStyle(.standard)
            .overlay(alignment: .bottom) {
                Text("Precipitation radar overlay requires MapKit tile overlay (UIKit integration)")
                    .font(.caption2)
                    .padding(8)
                    .background(.ultraThinMaterial)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .padding()
            }
            .onAppear {
                if let coord = locationManager.currentLocation {
                    position = .region(MKCoordinateRegion(
                        center: coord,
                        span: MKCoordinateSpan(latitudeDelta: 3, longitudeDelta: 3)
                    ))
                }
            }
            .navigationTitle("Radar")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Weather Tile Overlay (UIKit bridge for precipitation tiles)

struct WeatherTileOverlay: UIViewRepresentable {
    func makeUIView(context: Context) -> MKMapView {
        let mapView = MKMapView()
        let overlay = MKTileOverlay(urlTemplate: "https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=\(Secrets.apiKey)")
        overlay.canReplaceMapContent = false
        mapView.addOverlay(overlay, level: .aboveLabels)
        mapView.delegate = context.coordinator
        return mapView
    }

    func updateUIView(_ uiView: MKMapView, context: Context) {}

    func makeCoordinator() -> Coordinator { Coordinator() }

    class Coordinator: NSObject, MKMapViewDelegate {
        func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
            if let tileOverlay = overlay as? MKTileOverlay {
                return MKTileOverlayRenderer(tileOverlay: tileOverlay)
            }
            return MKOverlayRenderer(overlay: overlay)
        }
    }
}
