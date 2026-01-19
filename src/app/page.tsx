'use client';

import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 via-purple-900/20 to-black text-white">
      <div className="flex flex-col items-center w-full max-w-6xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          Crypto Trends Today
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-center max-w-2xl text-gray-300">
          Discover daily crypto trends from Twitter and Farcaster
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button
            onClick={() => fetchTrend('trend-crypto')}
            disabled={loading}
            className={`p-8 rounded-2xl text-left transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 border-2 text-white font-semibold ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-800 border-purple-400 hover:from-purple-500 hover:to-purple-700'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">🟠 What's popping on CT?</h2>
            <p className="text-lg text-gray-200">Top narrative 24h</p>
          </button>

          <button
            onClick={() => fetchTrend('trend-farcaster')}
            disabled={loading}
            className={`p-8 rounded-2xl text-left transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2 border-2 text-white font-semibold ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-800 border-blue-400 hover:from-blue-500 hover:to-blue-700'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">🟦 Farcaster/Base alpha</h2>
            <p className="text-lg text-gray-200">What's hot on Base 24h</p>
          </button>

          <button
            onClick={() => fetchTrend('token-solana')}
            disabled={loading}
            className={`p-8 rounded-2xl text-left transition-all duration-300 shadow-2xl hover:shadow-green-500/25 hover:-translate-y-2 border-2 text-white font-semibold ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-800 border-green-400 hover:from-green-500 hover:to-emerald-700'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">🟩 Solana degen play</h2>
            <p className="text-lg text-gray-200">2h mentions leader</p>
          </button>

          <button
            onClick={() => fetchTrend('token-base')}
            disabled={loading}
            className={`p-8 rounded-2xl text-left transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-2 border-2 text-white font-semibold ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-800 border-indigo-400 hover:from-indigo-500 hover:to-purple-700'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">🟣 Base/ETH moonshot</h2>
            <p className="text-lg text-gray-200">Fresh 2h pump</p>
          </button>
        </div>

        {loading && (
          <div className="mt-16 flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-purple-400 border-t-white rounded-full animate-spin" />
            <p className="text-2xl text-purple-400 font-semibold">Loading alpha...</p>
          </div>
        )}

        {error && (
          <div className="mt-16 p-8 bg-red-900/80 border-2 border-red-500 rounded-2xl">
            <p className="text-2xl text-red-200 font-semibold">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-16 w-full max-w-3xl bg-gray-900/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border-2 border-purple-500/50">
            <h3 className="text-4xl font-black mb-6 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              🔥 Hottest Right Now
            </h3>
            <div className="text-2xl md:text-3xl text-center p-8 rounded-2xl bg-gradient-to-r from-gray-800 to-black border border-gray-600 font-semibold">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
