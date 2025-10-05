'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ExtremeProbabilities } from '@/types/weather';

interface ProbabilityChartProps {
  probabilities: ExtremeProbabilities;
}

export default function ProbabilityChart({ probabilities }: ProbabilityChartProps) {
  const data = [
    { 
      name: 'Very Hot', 
      probability: probabilities.very_hot.probability,
      threshold: `>${probabilities.very_hot.threshold}°C`,
      confidence: probabilities.very_hot.confidence
    },
    { 
      name: 'Very Cold', 
      probability: probabilities.very_cold.probability,
      threshold: `<${probabilities.very_cold.threshold}°C`,
      confidence: probabilities.very_cold.confidence
    },
    { 
      name: 'Very Wet', 
      probability: probabilities.very_wet.probability,
      threshold: `>${probabilities.very_wet.threshold}mm/hr`,
      confidence: probabilities.very_wet.confidence
    },
    { 
      name: 'Very Windy', 
      probability: probabilities.very_windy.probability,
      threshold: `>${probabilities.very_windy.threshold}km/h`,
      confidence: probabilities.very_windy.confidence
    },
    { 
      name: 'High Humidity', 
      probability: probabilities.uncomfortable_humidity.probability,
      threshold: `>${probabilities.uncomfortable_humidity.threshold}%`,
      confidence: probabilities.uncomfortable_humidity.confidence
    }
  ];

  const getBarColor = (probability: number) => {
    if (probability < 20) return '#10b981';
    if (probability < 40) return '#3b82f6';
    if (probability < 60) return '#f59e0b';
    if (probability < 80) return '#f97316';
    return '#ef4444';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">Probability: {data.probability.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">Threshold: {data.threshold}</p>
          <p className="text-xs text-gray-500">Confidence: {data.confidence}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Extreme Weather Probabilities</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.probability)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Low Risk (0-20%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">Moderate (20-40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded"></div>
          <span className="text-xs text-gray-600">High (40-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-xs text-gray-600">Very High (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-xs text-gray-600">Extreme (80-100%)</span>
        </div>
      </div>
    </div>
  );
}