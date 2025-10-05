'use client';

import { CheckResponse } from '@/types/weather';
import ProbabilityChart from './ProbabilityChart';
import WeatherMetrics from './WeatherMetrics';
import Recommendations from './Recommendations';

interface WeatherDashboardProps {
  data: CheckResponse;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export default function WeatherDashboard({ data, onExportCSV, onExportJSON }: WeatherDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-emerald-700';
    if (score >= 3) return 'text-amber-700';
    return 'text-red-700';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4) return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200';
    if (score >= 3) return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200';
    return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-sm border p-8 ${getScoreBgColor(data.score)}`}>
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(data.score)} mb-2`}>
            {data.score}/5
          </div>
          <div className={`text-2xl font-semibold ${getScoreColor(data.score)} mb-4`}>
            {data.classification}
          </div>
          <p className="text-base text-gray-700 max-w-2xl mx-auto">{data.justification}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ProbabilityChart probabilities={data.probabilities} />
        <WeatherMetrics weatherData={data.weather_data} />
      </div>

      <Recommendations recommendations={data.recommendations} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(data.weather_data.temperature_distribution.percentiles).map(([percentile, value]) => (
            <div key={percentile} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}°</div>
              <div className="text-xs text-gray-500 mt-1">{percentile}th percentile</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Mean: {data.weather_data.temperature_distribution.mean.toFixed(1)}°C | 
          Std Dev: {data.weather_data.temperature_distribution.std.toFixed(1)}°C
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onExportCSV}
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all hover:shadow-md"
        >
          📊 Export CSV
        </button>
        <button
          onClick={onExportJSON}
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all hover:shadow-md"
        >
          📄 Export JSON
        </button>
      </div>
    </div>
  );
}