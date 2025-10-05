'use client';

import { useState } from 'react';
import { ComparisonResponse } from '@/types/weather';
import { weatherApi } from '@/services/api';

interface LocationComparisonProps {
  activity: string;
  date: string;
}

export default function LocationComparison({ activity, date }: LocationComparisonProps) {
  const [locations, setLocations] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);

  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const handleCompare = async () => {
    const validLocations = locations.filter(loc => loc.trim() !== '');
    if (validLocations.length < 2) {
      alert('Please enter at least 2 locations to compare');
      return;
    }

    setLoading(true);
    try {
      const response = await weatherApi.compareLocations({
        locations: validLocations,
        date,
        activity
      });
      setComparison(response);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compare Locations</h3>
      
      <div className="space-y-3 mb-4">
        {locations.map((location, index) => (
          <input
            key={index}
            type="text"
            value={location}
            onChange={(e) => handleLocationChange(index, e.target.value)}
            placeholder={`Location ${index + 1}`}
className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ))}
      </div>

      <button
        onClick={handleCompare}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-all"
      >
        {loading ? 'Comparing...' : 'Compare Locations'}
      </button>

      {comparison && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800">Best Location</p>
            <p className="text-xl font-bold text-green-900">{comparison.best_location}</p>
          </div>

          <div className="space-y-3">
            {comparison.comparison_data.map((location, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{location.location}</h4>
                  <div className={`text-2xl font-bold ${
                    location.score >= 4 ? 'text-green-600' :
                    location.score >= 3 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {location.score}/5
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Temp:</span>
                    <span className="ml-1 font-medium">{location.weather_data.avg_temp_c.toFixed(1)}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rain:</span>
                    <span className="ml-1 font-medium">{location.weather_data.avg_precipitation_mmhr.toFixed(1)}mm/hr</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Wind:</span>
                    <span className="ml-1 font-medium">{location.weather_data.avg_wind_speed_kmh.toFixed(1)}km/h</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-600">Risk Levels:</div>
                  <div className="flex gap-1 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      location.probabilities.very_hot.probability > 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      Heat: {location.probabilities.very_hot.probability.toFixed(0)}%
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      location.probabilities.very_wet.probability > 30 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      Rain: {location.probabilities.very_wet.probability.toFixed(0)}%
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      location.probabilities.very_windy.probability > 30 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      Wind: {location.probabilities.very_windy.probability.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}