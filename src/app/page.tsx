// Комментарий: Главная страница с пузырьками + 4 кнопками для трендов (деген названия)
// Пузырьки позади кнопок (z-index), не мешают кликам

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
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 via-purple-900/20 to-black text-white overflow-hidden">
      {/* Комментарий: Пузырьки - фон, z-index: 0, НЕ ловят клики */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Большой пузырь слева */}
        <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-xl animate-bubble1" />
        {/* Пузырь справа сверху */}
        <div className="absolute w-48 h-48 bg-blue-500/20 rounded-full blur-xl animate-bubble2 right-20 top-20" />
        {/* Пузырь снизу */}
        <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full blur-xl animate-bubble3 bottom-10 left-1/4" />
        {/* Маленький пузырь */}
        <div className="absolute w-32 h-32 bg-pink-500/20 rounded-full blur-lg animate-bubble4 top-1/2 right-10" />
        {/* Пузырь с поворотом */}
        <div className="absolute w-56 h-56 bg-green-500/20 rounded-full blur-xl animate-bubble5 left-10 bottom-40 rotate-12" />
        {/* Центр - самый медленный */}
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-bubble6" />
      </div>

      {/* Комментарий: Контент поверх пузырьков z-index: 10 */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
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
            className={`group relative p-8 rounded-2xl text-left transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 border-2 ${
              loading
                ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-purple-800/90 to-purple-900/90 border-purple-500/50 hover:from-purple-700/90 hover:to-purple-800/90 backdrop-blur-sm'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🟠 What's popping on CT?
            </h2>
            <p className="text-lg text-gray-300 font-medium">Top narrative 24h</p>
          </button>

          <button
            onClick={() => fetchTrend('trend-farcaster')}
            disabled={loading}
            className={`group relative p-8 rounded-2xl text-left transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2 border-2 ${
              loading
                ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-blue-800/90 to-blue-900/90 border-blue-500/50 hover:from-blue-700/90 hover:to-blue-800/90 backdrop-blur-sm'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🟦 Farcaster/Base alpha
            </h2>
            <p className="text-lg text-gray-300 font-medium">What's hot on Base 24h</p>
          </button>

          <button
            onClick={() => fetchTrend('token-solana')}
            disabled={loading}
            className={`group relative p-8 rounded-2xl text-left transition-all duration-300 shadow-2xl hover:shadow-green-500/25 hover:-translate-y-2 border-2 ${
              loading
                ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-green-800/90 to-emerald-900/90 border-green-500/50 hover:from-green-700/90 hover:to-emerald-800/90 backdrop-blur-sm'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              🟩 Solana degen play
            </h2>
            <p className="text-lg text-gray-300 font-medium">2h mentions leader</p>
          </button>

          <button
            onClick={() => fetchTrend('token-base')}
            disabled={loading}
            className={`group relative p-8 rounded-2xl text-left transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-2 border-2 ${
              loading
                ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-indigo-800/90 to-purple-900/90 border-indigo-500/50 hover:from-indigo-700/90 hover:to-purple-800/90 backdrop-blur-sm'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              🟣 Base/ETH moonshot
            </h2>
            <p className="text-lg text-gray-300 font-medium">Fresh 2h pump</p>
          </button>
        </div>

        {loading && (
          <div className="mt-16 flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-2xl text-purple-400 font-semibold">Loading alpha...</p>
          </div>
        )}

        {error && (
          <div className="mt-16 p-8 bg-red-900/50 border border-red-500/50 rounded-2xl backdrop-blur-sm">
            <p className="text-2xl text-red-300 font-semibold">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-16 w-full max-w-3xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-purple-500/30">
            <h3 className="text-4xl font-black mb-6 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
              🔥 Hottest Right Now
            </h3>
            <div className="text-2xl md:text-3xl text-center break-words bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent font-semibold p-6 rounded-2xl bg-black/20 border border-white/10">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>

    {/* Комментарий: CSS анимации для пузырьков - добавляем в конец */}
    <style jsx>{`
      @keyframes bubble1 {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        33% { transform: translateY(-30px) translateX(20px); }
        66% { transform: translateY(-10px) translateX(-15px); }
      }
      @keyframes bubble2 {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-20px) translateX(10px); }
        100% { transform: translateY(0px) translateX(-5px); }
      }
      @keyframes bubble3 {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-25px) scale(1.05); }
      }
      @keyframes bubble4 {
        0%, 100% { transform: translateX(0px) translateY(0px) scale(0.8); }
        33% { transform: translateX(15px) translateY(-10px) scale(1); }
        66% { transform: translateX(-10px) translateY(5px) scale(0.9); }
      }
      @keyframes bubble5 {
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(12deg); }
        50% { transform: translateY(-15px) translateX(10px) rotate(15deg); }
      }
      @keyframes bubble6 {
        0%, 100% { transform: scale(1) translateY(0px); }
        50% { transform: scale(1.1) translateY(-10px); }
      }
      
      .animate-bubble1 { animation: bubble1 20s ease-in-out infinite; }
      .animate-bubble2 { animation: bubble2 25s ease-in-out infinite reverse; }
      .animate-bubble3 { animation: bubble3 30s ease-in-out infinite; }
      .animate-bubble4 { animation: bubble4 18s ease-in-out infinite reverse; }
      .animate-bubble5 { animation: bubble5 22s ease-in-out infinite; }
      .animate-bubble6 { animation: bubble6 35s ease-in-out infinite reverse; }
    `}</style>
  );
}
