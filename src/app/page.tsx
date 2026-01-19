'use client';

import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Комментарий: Универсальная функция для запроса к любому из 4 API-роутов
  const fetchTrend = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.message || data.topTrend || data.topToken || 'No data received');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load trend. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-5xl font-bold mb-8 text-center">Crypto Trends Today</h1>
      <p className="text-xl mb-12 text-center max-w-2xl">
        Discover daily crypto trends from Twitter and Farcaster
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button
          onClick={() => fetchTrend('trend-crypto')}
          disabled={loading}
          className={`p-6 rounded-xl text-left transition-all ${
            loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-purple-800 hover:bg-purple-700 shadow-lg'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">1. Theme of the day in crypto twitter</h2>
          <p className="text-gray-300">Most mentioned topic in last 24 hours</p>
        </button>

        <button
          onClick={() => fetchTrend('trend-farcaster')}
          disabled={loading}
          className={`p-6 rounded-xl text-left transition-all ${
            loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-blue-800 hover:bg-blue-700 shadow-lg'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">2. Top theme in Farcaster / Base</h2>
          <p className="text-gray-300">Hottest topic in last 24 hours</p>
        </button>

        <button
          onClick={() => fetchTrend('token-solana')}
          disabled={loading}
          className={`p-6 rounded-xl text-left transition-all ${
            loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-green-800 hover:bg-green-700 shadow-lg'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">3. Promising Solana token</h2>
          <p className="text-gray-300">Most mentioned in last 2 hours</p>
        </button>

        <button
          onClick={() => fetchTrend('token-base')}
          disabled={loading}
          className={`p-6 rounded-xl text-left transition-all ${
            loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-indigo-800 hover:bg-indigo-700 shadow-lg'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">4. Promising Base / ETH token</h2>
          <p className="text-gray-300">Most mentioned in last 2 hours</p>
        </button>
      </div>

      {loading && (
        <p className="mt-12 text-xl text-purple-400 animate-pulse">Loading trend data...</p>
      )}

      {error && (
        <p className="mt-12 text-xl text-red-400">{error}</p>
      )}

      {result && (
        <div className="mt-12 w-full max-w-2xl bg-gray-800 rounded-2xl p-8 shadow-2xl border border-purple-500/30">
          <h3 className="text-3xl font-bold mb-4 text-center">Today's Trend</h3>
          <p className="text-2xl text-center break-words">{result}</p>
        </div>
      )}
    </main>
  );
}
