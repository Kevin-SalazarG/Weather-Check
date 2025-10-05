'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ClimateTrendsResponse } from '@/types/weather';

interface TrendChartProps {
  trends: ClimateTrendsResponse;
}

export default function TrendChart({ trends }: TrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(1)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Climate Trends Analysis</h3>
        <p className="text-sm text-gray-600 mt-1">
          Temperature trend: {trends.temperature_trend > 0 ? '📈' : '📉'} {Math.abs(trends.analysis.temp_change_per_decade).toFixed(2)}°C per decade
        </p>
        {trends.analysis.increasing_extreme_events && (
          <p className="text-sm text-orange-600 mt-1">⚠️ Increasing extreme weather events detected</p>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trends.yearly_data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="temp"
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="events"
            orientation="right"
            label={{ value: 'Extreme Days', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#6b7280' } }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            yAxisId="temp"
            type="monotone" 
            dataKey="avg_temp" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Avg Temperature"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
          <Line 
            yAxisId="events"
            type="monotone" 
            dataKey="extreme_heat_days" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Extreme Heat Days"
            dot={{ fill: '#ef4444', r: 4 }}
          />
          <Line 
            yAxisId="events"
            type="monotone" 
            dataKey="extreme_cold_days" 
            stroke="#06b6d4" 
            strokeWidth={2}
            name="Extreme Cold Days"
            dot={{ fill: '#06b6d4', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}