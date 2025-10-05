'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LatLng } from 'leaflet';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const useMapEvents = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMapEvents),
  { ssr: false }
) as any;

interface LocationMapProps {
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
  selectedLocation?: { lat: number; lng: number };
}

function LocationSelector({ onLocationSelect }: { onLocationSelect: (latlng: LatLng) => void }) {
  const MapEvents = useMapEvents;
  
  MapEvents({
    click: (e: any) => {
      onLocationSelect(e.latlng);
    },
  });
  
  return null;
}

export default function LocationMap({ onLocationSelect, selectedLocation }: LocationMapProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
    });
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

  if (!mounted || !L) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  const icon = L.icon({
    iconUrl: '/leaflet/marker-icon.png',
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={[40, -95]} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationSelector onLocationSelect={handleMapClick} />
        {position && (
          <Marker position={position} icon={icon}>
            <Popup>
              Selected Location<br />
              Lat: {position[0].toFixed(4)}<br />
              Lng: {position[1].toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}