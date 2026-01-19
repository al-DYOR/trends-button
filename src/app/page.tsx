// Комментарий: Главная страница приложения
// Здесь 4 кнопки для получения трендов
// Интерфейс полностью на английском, комментарии на русском

'use client';

import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Комментарий: Универсальная функция для запроса к одному из API-роутов
  const fetchTrend = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Комментарий: Результат приходит в поле topTrend или topToken
      setResult(data.topTrend || data.topToken || 'No data received');
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load trend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white flex flex-col items-center justify-center p-6 md:p-8">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Crypto Trends Today
      </h1>

      <p className="text-lg md:text-xl mb-12 text-center text-gray-300 max-w-3xl">
        Discover the hottest topics and promising tokens from Twitter and Farcaster right now
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* Button 1 */}
        <button
          onClick={() => fetchTrend('trend-crypto')}
          disabled={loading}
          className={`group relative p-8 rounded-2xl backdrop-blur-md border border-purple-500/30 transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20'
          } bg-gray-900/60`}
        >
          <h2 className="text-2xl font-bold mb-2">Theme of the day in crypto twitter</h2>
          <p className="text-sm text-gray-400">Most mentioned topic in last 24 hours</p>
        </button>

        {/* Button 2 */}
        <button
          onClick={() => fetchTrend('trend-farcaster')}
          disabled={loading}
          className={`group relative p-8 rounded-2xl backdrop-blur-md border border-blue-500/30 transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20'
          } bg-gray-900/60`}
        >
          <h2 className="text-2xl font-bold mb-2">Top theme in Farcaster / Base</h2>
          <p className="text-sm text-gray-400">Hottest topic in last 24 hours</p>
        </button>

        {/* Button 3 */}
        <button
          onClick={() => fetchTrend('token-solana')}
          disabled={loading}
          className={`group relative p-8 rounded-2xl backdrop-blur-md border border-green-500/30 transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/20'
          } bg-gray-900/60`}
        >
          <h2 className="text-2xl font-bold mb-2">Promising Solana token</h2>
          <p className="text-sm text-gray-400">Most mentioned in last 2 hours</p>
        </button>

        {/* Button 4 */}
        <button
          onClick={() => fetchTrend('token-base')}
          disabled={loading}
          className={`group relative p-8 rounded-2xl backdrop-blur-md border border-indigo-500/30 transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/20'
          } bg-gray-900/60`}
        >
          <h2 className="text-2xl font-bold mb-2">Promising Base / ETH token</h2>
          <p className="text-sm text-gray-400">Most mentioned in last 2 hours</p>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-16 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-purple-400">Loading trend data...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-16 text-xl text-red-400 text-center max-w-md">
          {error}
        </p>
      )}

      {/* Result */}
      {result && !loading && !error && (
        <div className="mt-16 w-full max-w-3xl bg-gray-800/80 backdrop-blur-md border border-purple-500/40 rounded-3xl p-10 shadow-2xl">
          <h3 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Today's Top Trend
          </h3>
          <p className="text-2xl text-center leading-relaxed break-words">
            {result}
          </p>
        </div>
      )}
    </main>
  );
}