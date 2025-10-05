'use client';

import { useState } from 'react';
import { CheckRequest } from '@/types/weather';
import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('./LocationMap'), { ssr: false });

interface WeatherFormProps {
  onSubmit: (data: CheckRequest) => void;
  loading: boolean;
}

export default function WeatherForm({ onSubmit, loading }: WeatherFormProps) {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [activity, setActivity] = useState('Hiking');
  const [useMap, setUseMap] = useState(false);
  const [mapSelection, setMapSelection] = useState<string | null>(null);

  const activities = [
    'Hiking', 'Cycling', 'Picnic', 'Running / Outdoor Sports',
    'Outdoor Market', 'Beach', 'Camping', 'Festival'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && date && activity) {
      onSubmit({ location, date, activity });
    }
  };

  const handleLocationFromMap = (locationData: { lat: number; lng: number; name: string }) => {
    setMapSelection(locationData.name);
  };

  const handleConfirmLocation = () => {
    if (mapSelection) {
      setLocation(mapSelection);
      setUseMap(false);
      setMapSelection(null); // Limpia la selección
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">Location</label>
          <button
            type="button"
            onClick={() => setUseMap(!useMap)}
            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            {useMap ? '✏️ Type Location' : '📍 Use Map'}
          </button>
        </div>
        
        {useMap ? (
          <div className="space-y-3">
            <LocationMap onLocationSelect={handleLocationFromMap} />
            {mapSelection && (
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
                Selected: {mapSelection}
              </div>
            )}
            <button
              type="button"
              onClick={handleConfirmLocation}
              disabled={!mapSelection}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-all"
            >
              Confirm Location
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, Paris, Tokyo"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
            required
          />
        )}
      </div>

      {/* ... El resto del formulario sigue igual ... */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Activity</label>
        <div className="grid grid-cols-2 gap-2">
          {activities.map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setActivity(act)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                activity === act
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
      >
        {loading ? "Analyzing Weather Data..." : 'Check Weather Suitability'}
      </button>
    </form>
  );
}