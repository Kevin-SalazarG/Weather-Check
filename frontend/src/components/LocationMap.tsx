'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css'; // <-- ¡IMPORTANTE! Añade esta línea

interface LocationMapProps {
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
}

// Componente para centrar el mapa
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Componente para manejar los clics
function LocationSelector({ onLocationSelect }: { onLocationSelect: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function LocationMap({ onLocationSelect }: LocationMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40, -95]); // Fallback
  const [L, setL] = useState<any>(null);

  // Carga los íconos de Leaflet y la geolocalización del usuario
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      // Corrige el problema de los íconos por defecto en Next.js
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });

    // Pide la ubicación del usuario para centrar el mapa
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        console.log("Geolocation permission denied. Using default map center.");
      }
    );
  }, []);
  
  const handleMapClick = async (latlng: LatLng) => {
    setPosition([latlng.lat, latlng.lng]);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      const data = await response.json();
      
      const locationName = data.address?.city || 
                           data.address?.town || 
                           data.address?.village || 
                           data.display_name?.split(',')[0] ||
                           `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
      
      onLocationSelect({
        lat: latlng.lat,
        lng: latlng.lng,
        name: locationName
      });
    } catch (error) {
      onLocationSelect({
        lat: latlng.lat,
        lng: latlng.lng,
        name: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
      });
    }
  };

  if (!L) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }
  
  return (
    <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={mapCenter} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationSelector onLocationSelect={handleMapClick} />
        {position && (
          <Marker position={position}>
            <Popup>
              Selected Location
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}