'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  distance: number;
  onDistanceChange: (distance: number) => void;
  onRegionSelect: (region: string) => void;
}

export default function Map({ distance, onDistanceChange, onRegionSelect }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStart, setSelectedStart] = useState('51.8126,5.8372'); // Nijmegen
  const [routeInfo, setRouteInfo] = useState('Select a German destination to calculate route');

  const startLocations = [
    { name: 'Nijmegen', coords: '51.8126,5.8372' },
    { name: 'Venlo', coords: '51.4416,5.4697' },
    { name: 'Rotterdam', coords: '51.9225,4.4792' },
    { name: 'Amsterdam', coords: '52.3676,4.9041' },
    { name: 'Eindhoven', coords: '51.6978,5.3037' },
    { name: 'Arnhem', coords: '51.9851,5.8987' },
    { name: 'Enschede', coords: '52.2215,6.8937' },
    { name: 'Maastricht', coords: '50.8514,5.6909' },
  ];

  const destinations = [
    { name: 'Kleve', lat: 51.7893, lng: 6.1386, stores: 'ALDI, Lidl, Kaufland' },
    { name: 'Aachen', lat: 50.7753, lng: 6.0839, stores: 'Shopping centers' },
    { name: 'Emmerich', lat: 51.8317, lng: 6.2475, stores: 'Border shopping' },
    { name: 'Oberhausen', lat: 51.4823, lng: 7.2161, stores: 'CentrO Mall' },
    { name: 'Düsseldorf', lat: 51.2277, lng: 6.7735, stores: 'Major city' },
    { name: 'Kaldenkirchen', lat: 51.3125, lng: 6.1952, stores: 'Near Venlo' },
  ];

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [51.8, 6.0],
      zoom: 8,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add heat map overlay regions with colors matching Duitsland.jpg
    const regions = [
      // Close to border (orange) - < 1 hour
      {
        name: 'Nijmegen Region',
        coords: [[51.7, 5.7], [51.7, 6.0], [52.0, 6.0], [52.0, 5.7]],
        color: '#f59e0b',
        fillOpacity: 0.3,
      },
      {
        name: 'Venlo Region',
        coords: [[51.3, 5.8], [51.3, 6.1], [51.6, 6.1], [51.6, 5.8]],
        color: '#f59e0b',
        fillOpacity: 0.3,
      },
      {
        name: 'Enschede Region',
        coords: [[52.1, 6.7], [52.1, 7.0], [52.4, 7.0], [52.4, 6.7]],
        color: '#fb923c',
        fillOpacity: 0.3,
      },
      // Medium distance (red/orange) - 1-2 hours
      {
        name: 'Arnhem Region',
        coords: [[51.9, 5.7], [51.9, 6.2], [52.1, 6.2], [52.1, 5.7]],
        color: '#ef4444',
        fillOpacity: 0.25,
      },
      {
        name: 'Eindhoven Region',
        coords: [[51.3, 5.2], [51.3, 5.8], [51.6, 5.8], [51.6, 5.2]],
        color: '#dc2626',
        fillOpacity: 0.25,
      },
      // Far from border (dark red) - 2-4 hours
      {
        name: 'Amsterdam Region',
        coords: [[52.2, 4.7], [52.2, 5.2], [52.5, 5.2], [52.5, 4.7]],
        color: '#991b1b',
        fillOpacity: 0.25,
      },
      {
        name: 'Rotterdam Region',
        coords: [[51.8, 4.2], [51.8, 4.7], [52.1, 4.7], [52.1, 4.2]],
        color: '#991b1b',
        fillOpacity: 0.25,
      },
    ];

    regions.forEach((region) => {
      L.polygon(region.coords as L.LatLngExpression[], {
        color: region.color,
        fillColor: region.color,
        fillOpacity: region.fillOpacity,
        weight: 1,
      })
        .addTo(map)
        .bindPopup(`<b>${region.name}</b><br>Click below to calculate exact savings`);
    });

    // Add NL-DE border line
    const borderPoints: L.LatLngExpression[] = [
      [51.0, 6.0],
      [51.5, 6.0],
      [52.0, 6.5],
      [52.5, 7.0],
      [53.0, 7.2],
    ];
    L.polyline(borderPoints, {
      color: '#dc2626',
      weight: 3,
      opacity: 0.6,
      dashArray: '10, 10',
    })
      .addTo(map)
      .bindPopup('<b>NL-DE Border</b>');

    // Add city markers
    const nlIcon = L.divIcon({
      html: '<div style="font-size: 20px">🇳🇱</div>',
      className: 'custom-marker',
      iconSize: [25, 25],
    });

    const deIcon = L.divIcon({
      html: '<div style="font-size: 20px">🇩🇪</div>',
      className: 'custom-marker',
      iconSize: [25, 25],
    });

    startLocations.forEach((loc) => {
      const [lat, lng] = loc.coords.split(',').map(Number);
      L.marker([lat, lng], { icon: nlIcon })
        .addTo(map)
        .bindPopup(`<b>${loc.name}, NL</b>`);
    });

    destinations.forEach((dest) => {
      L.marker([dest.lat, dest.lng], { icon: deIcon })
        .addTo(map)
        .bindPopup(`<b>${dest.name}, DE</b><br>${dest.stores}`);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const calculateRoute = async (destLat: number, destLng: number, destName: string) => {
    const [startLat, startLng] = selectedStart.split(',').map(Number);
    const startCity = startLocations.find((l) => l.coords === selectedStart)?.name || '';

    setRouteInfo('⏳ Calculating route...');

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Math.round(route.distance / 1000);
        const durationMin = Math.round(route.duration / 60);

        onDistanceChange(distanceKm);

        // Clear existing route layers
        mapRef.current?.eachLayer((layer) => {
          if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
            const isDashed = (layer.options as any).dashArray;
            if (!isDashed) {
              mapRef.current?.removeLayer(layer);
            }
          }
          if (layer instanceof L.Marker) {
            const html = (layer.getIcon() as any)?.options?.html;
            if (html?.includes('🏠') || html?.includes('🛒')) {
              mapRef.current?.removeLayer(layer);
            }
          }
        });

        // Add route markers
        const homeIcon = L.divIcon({
          html: '<div style="font-size: 25px">🏠</div>',
          className: 'custom-marker',
          iconSize: [30, 30],
        });

        const cartIcon = L.divIcon({
          html: '<div style="font-size: 25px">🛒</div>',
          className: 'custom-marker',
          iconSize: [30, 30],
        });

        L.marker([startLat, startLng], { icon: homeIcon })
          .addTo(mapRef.current!)
          .bindPopup(`<b>📍 ${startCity}</b>`);

        L.marker([destLat, destLng], { icon: cartIcon })
          .addTo(mapRef.current!)
          .bindPopup(`<b>🛒 ${destName}</b><br>${distanceKm}km / ${durationMin} min`);

        // Draw route
        const routeCoords = route.geometry.coordinates.map((coord: number[]) => [
          coord[1],
          coord[0],
        ] as L.LatLngExpression);
        const routeLine = L.polyline(routeCoords, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.7,
        }).addTo(mapRef.current!);

        mapRef.current?.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

        setRouteInfo(`✅ ${startCity} → ${destName}: ${distanceKm}km (${durationMin} min drive)`);
        onRegionSelect(startCity);
      }
    } catch (error) {
      setRouteInfo('❌ Error calculating route');
    }
  };

  return (
    <div className="space-y-4">
      {/* Starting Location Selector */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🏠 Your starting location (Netherlands):
        </label>
        <select
          value={selectedStart}
          onChange={(e) => setSelectedStart(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {startLocations.map((loc) => (
            <key={loc.coords} value={loc.coords}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div ref={mapContainerRef} className="h-[600px] rounded-lg shadow-lg border-2 border-gray-200" />

      {/* Route Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-gray-700">{routeInfo}</p>
      </div>

      {/* Destination Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          🇩🇪 Popular German Shopping Destinations:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {destinations.map((dest) => (
            <button
              key={dest.name}
              onClick={() => calculateRoute(dest.lat, dest.lng, dest.name)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
            >
              🇩🇪 {dest.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
