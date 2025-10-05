'use client';

import { WeatherData } from '@/types/weather';

interface WeatherMetricsProps {
  weatherData: WeatherData;
}

export default function WeatherMetrics({ weatherData }: WeatherMetricsProps) {
  const metrics = [
    {
      label: 'Temperature',
      value: weatherData.avg_temp_c,
      unit: '°C',
      range: `${weatherData.min_temp_c.toFixed(1)}° - ${weatherData.max_temp_c.toFixed(1)}°`,
      icon: '🌡️',
      color: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
    },
    {
      label: 'Precipitation',
      value: weatherData.avg_precipitation_mmhr,
      unit: 'mm/hr',
      icon: '💧',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
    },
    {
      label: 'Wind Speed',
      value: weatherData.avg_wind_speed_kmh,
      unit: 'km/h',
      icon: '💨',
      color: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
    },
    {
      label: 'Humidity',
      value: weatherData.avg_humidity_percent,
      unit: '%',
      icon: '💦',
      color: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200'
    },
    {
      label: 'Cloud Cover',
      value: weatherData.avg_cloud_cover_percent,
      unit: '%',
      icon: '☁️',
      color: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
    },
    {
      label: 'UV Index',
      value: weatherData.avg_uv_index,
      unit: '',
      icon: '☀️',
      color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Metrics</h3>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className={`p-4 rounded-lg border ${metric.color}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {metric.label}
              </div>
              <span className="text-xl">{metric.icon}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
              <span className="text-sm font-normal text-gray-600 ml-1">{metric.unit}</span>
            </div>
            {metric.range && (
              <div className="text-xs text-gray-500 mt-1">{metric.range}</div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">Data Source:</span> {weatherData.data_source}
          </div>
          <div className="text-gray-500">
            {weatherData.years_analyzed} data points analyzed
          </div>
        </div>
      </div>
    </div>
  );
}