'use client';

import { CheckResponse } from '@/types/weather';

interface ResultsProps {
  data: CheckResponse;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export default function Results({ data, onExportCSV, onExportJSON }: ResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-emerald-700';
    if (score >= 3) return 'text-amber-700';
    return 'text-red-700';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4) return 'bg-emerald-50 border-emerald-200';
    if (score >= 3) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={`bg-white rounded-xl shadow-sm border p-6 sm:p-8 ${getScoreBgColor(data.score)}`}>
        <div className="text-center">
          <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor(data.score)} mb-2`}>
            {data.score}/5
          </div>
          <div className={`text-xl sm:text-2xl font-semibold ${getScoreColor(data.score)} mb-3 sm:mb-4`}>
            {data.classification}
          </div>
          <p className="text-sm sm:text-base text-gray-700">{data.justification}</p>
        </div>
      </div>

      {data.weather_data && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Weather Details</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Temperature</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {data.weather_data.avg_temp_c}°C
              </div>
              {data.weather_data.min_temp_c && data.weather_data.max_temp_c && (
                <div className="text-xs text-gray-500 mt-1">
                  {data.weather_data.min_temp_c}° - {data.weather_data.max_temp_c}°
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Precipitation</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {data.weather_data.avg_precipitation_mmhr}
              </div>
              <div className="text-xs text-gray-500 mt-1">mm/hr</div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Wind Speed</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {data.weather_data.avg_wind_speed_kmh}
              </div>
              <div className="text-xs text-gray-500 mt-1">km/h</div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Humidity</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {data.weather_data.avg_humidity_percent}%
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
              <div className="text-gray-600">
                <span className="font-medium">Data Source:</span> {data.weather_data.data_source}
              </div>
              <div className="text-gray-500">
                {data.weather_data.years_analyzed} historical data points
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onExportCSV}
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          Export CSV
        </button>
        <button
          onClick={onExportJSON}
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}