'use client';

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  const getIcon = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('heat') || recommendation.toLowerCase().includes('sun')) return '☀️';
    if (recommendation.toLowerCase().includes('cold') || recommendation.toLowerCase().includes('layer')) return '🧥';
    if (recommendation.toLowerCase().includes('rain') || recommendation.toLowerCase().includes('water')) return '🌧️';
    if (recommendation.toLowerCase().includes('wind')) return '💨';
    if (recommendation.toLowerCase().includes('humid')) return '💦';
    if (recommendation.toLowerCase().includes('uv')) return '🧴';
    if (recommendation.toLowerCase().includes('favorable')) return '✅';
    return '💡';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3">
            <span className="text-2xl flex-shrink-0">{getIcon(rec)}</span>
            <p className="text-sm text-gray-700">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}