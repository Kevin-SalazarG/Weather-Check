'use client';

import { useState } from 'react';
import WeatherForm from '@/components/WeatherForm';
import Results from '@/components/Results';
import { weatherApi } from '@/services/api';
import { CheckRequest, CheckResponse } from '@/types/weather';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<CheckRequest | null>(null);

  const handleSubmit = async (data: CheckRequest) => {
    setLoading(true);
    setError(null);
    setLastRequest(data);

    try {
      const response = await weatherApi.checkWeather(data);
      setResult(response);
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
    <main className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Will It Rain On My Parade?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Check weather suitability for your outdoor activities using NASA data
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Plan Your Activity</h2>
            <WeatherForm onSubmit={handleSubmit} loading={loading} />
          </div>

          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl mb-4 sm:mb-6 text-sm sm:text-base">
                {error}
              </div>
            )}

            {result && (
              <Results
                data={result}
                onExportCSV={handleExportCSV}
                onExportJSON={handleExportJSON}
              />
            )}

            {!result && !error && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Ready to check the weather?</h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Enter your location and date to get started
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-gray-500">
          <p>Powered by NASA POWER API • Historical weather data from 1981-present</p>
        </footer>
      </div>
    </main>
  );
}