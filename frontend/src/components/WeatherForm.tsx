'use client';

import { useState } from 'react';
import { CheckRequest } from '@/types/weather';

interface WeatherFormProps {
  onSubmit: (data: CheckRequest) => void;
  loading: boolean;
}

export default function WeatherForm({ onSubmit, loading }: WeatherFormProps) {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [activity, setActivity] = useState('Hiking');

  const activities = [
    'Hiking',
    'Cycling',
    'Picnic',
    'Running / Outdoor Sports',
    'Outdoor Market'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && date && activity) {
      onSubmit({ location, date, activity });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., New York, Paris, Tokyo"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Activity
        </label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
        >
          {activities.map((act) => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
      >
        {loading ? 'Checking...' : 'Check Weather Suitability'}
      </button>
    </form>
  );
}