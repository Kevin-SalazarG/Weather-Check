'use client';

import { useState } from 'react';
import WeatherForm from '@/components/WeatherForm';
import WeatherDashboard from '@/components/WeatherDashboard';
import TrendChart from '@/components/TrendChart';
import LocationComparison from '@/components/LocationComparison';
import { weatherApi } from '@/services/api';
import { CheckRequest, CheckResponse, ClimateTrendsResponse } from '@/types/weather';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [trends, setTrends] = useState<ClimateTrendsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<CheckRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trends' | 'compare'>('dashboard');

  const handleSubmit = async (data: CheckRequest) => {
    setLoading(true);
    setError(null);
    setLastRequest(data);

    try {
      const [checkResponse, trendsResponse] = await Promise.all([
        weatherApi.checkWeather(data),
        weatherApi.getClimateTrends(data.location)
      ]);
      
      setResult(checkResponse);
      setTrends(trendsResponse);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!lastRequest) return;
    try {
      const blob = await weatherApi.exportCSV(lastRequest);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather_${lastRequest.location}_${lastRequest.date}.csv`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleExportJSON = async () => {
    if (!lastRequest) return;
    try {
      const blob = await weatherApi.exportJSON(lastRequest);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather_${lastRequest.location}_${lastRequest.date}.json`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Will It Rain On My Parade?
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 px-4">
              AI-powered weather analysis using NASA satellite data
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Real-time NASA data
              </span>
              <span className="flex items-center gap-1">
                🛰️ 10+ years historical analysis
              </span>
              <span className="flex items-center gap-1">
                📊 Statistical probabilities
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
                  Plan Your Activity
                </h2>
                <WeatherForm onSubmit={handleSubmit} loading={loading} />
              </div>

              {lastRequest && (
                <LocationComparison 
                  activity={lastRequest.activity} 
                  date={lastRequest.date} 
                />
              )}
            </div>

            <div className="lg:col-span-2">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
                  {error}
                </div>
              )}

              {result && (
                <>
                  <div className="mb-6">
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                          activeTab === 'dashboard'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => setActiveTab('trends')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                          activeTab === 'trends'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Climate Trends
                      </button>
                      <button
                        onClick={() => setActiveTab('compare')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                          activeTab === 'compare'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Compare
                      </button>
                    </div>
                  </div>

                  {activeTab === 'dashboard' && (
                    <WeatherDashboard
                      data={result}
                      onExportCSV={handleExportCSV}
                      onExportJSON={handleExportJSON}
                    />
                  )}

                  {activeTab === 'trends' && trends && (
                    <TrendChart trends={trends} />
                  )}

                  {activeTab === 'compare' && lastRequest && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <LocationComparison 
                        activity={lastRequest.activity} 
                        date={lastRequest.date} 
                      />
                    </div>
                  )}
                </>
              )}

              {!result && !error && !loading && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to check the weather?
                  </h3>
                  <p className="text-gray-500">
                    Enter your location and date to analyze historical weather patterns
                  </p>
                </div>
              )}

              {loading && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 text-lg">Analyzing NASA satellite data...</p>
                    <p className="text-gray-500 text-sm mt-2">Processing 10+ years of historical weather</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="mt-16 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
            <p>Powered by NASA POWER API • Statistical Analysis • Machine Learning</p>
            <p className="mt-2">© 2025 NASA Space Apps Challenge</p>
          </footer>
        </div>
      </div>
    </main>
  );
}