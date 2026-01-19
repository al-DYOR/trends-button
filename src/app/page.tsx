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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
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
          className={`p-6 rounded-xl text-left transition-all shadow-lg border-2 ${
            loading
              ? 'bg-gray-700 border-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-500 border-purple-400'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">🟠 What's popping on CT?</h2>
          <p className="text-gray-300">Top narrative 24h</p>
        </button>

        <button
          onClick={() => fetchTrend('trend-farcaster')}
          disabled={loading}
          className={`p-6 rounded-xl text-left transition-all shadow-lg border-2 ${
            loading
              ? 'bg-gray-700 border-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 border-blue-400'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">🟦 Farcaster/Base alpha</h2>
          <p className="text-gray-300">What's hot on Base 24h</p>
        </button>

        <button
          onClick={() => fetchTrend('token-solana')}
          disabled={loading}
          className={`p-6 rounded-xl text-left transition-all shadow-lg border-2 ${
            loading
              ? 'bg-gray-700 border-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 border-green-400'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">🟩 Solana degen play</h2>
          <p className="text-gray-300">2h mentions leader</p>
        </button>

        <button
          onClick={() => fetchTrend('token-base')}
          disabled={loading}
          className={`p-6 rounded-xl text-left transition-all shadow-lg border-2 ${
            loading
              ? 'bg-gray-700 border-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">🟣 Base/ETH moonshot</h2>
          <p className="text-gray-300">Fresh 2h pump</p>
        </button>
      </div>

      {loading && (
        <p className="mt-12 text-xl text-purple-400 animate-pulse">Loading alpha...</p>
      )}

      {error && (
        <p className="mt-12 text-xl text-red-400">{error}</p>
      )}

      {result && (
        <div className="mt-12 w-full max-w-2xl bg-gray-800 rounded-2xl p-8 shadow-2xl border border-purple-500/30">
          <h3 className="text-3xl font-bold mb-4 text-center text-purple-400">🔥 Hottest Right Now</h3>
          <p className="text-2xl text-center break-words">{result}</p>
        </div>
      )}
    </main>
  );
}
