'use client';

import { useState } from 'react';

type TrendData = {
  text: string;
};

export default function Home() {
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const text =
        result.topTrend ||
        result.topToken ||
        result.message ||
        'No data received';

      setData({ text });
    } catch (err: any) {
      setError(err.message || 'Failed to load trend. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%)',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        Crypto Trends Today
      </h1>

      <p
        style={{
          fontSize: '1.25rem',
          marginBottom: '2.5rem',
          textAlign: 'center',
          maxWidth: '640px',
          opacity: 0.9,
        }}
      >
        Discover daily crypto trends from Twitter and Farcaster
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        <button
          onClick={() => fetchTrend('trend-crypto')}
          disabled={loading}
          style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '2px solid #9333ea',
            backgroundColor: loading ? '#4b5563' : '#5b21b6',
            color: 'white',
            textAlign: 'left',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🟠 What's popping on CT?
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Top narrative 24h</p>
        </button>

        <button
          onClick={() => fetchTrend('trend-farcaster')}
          disabled={loading}
          style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '2px solid #3b82f6',
            backgroundColor: loading ? '#4b5563' : '#1d4ed8',
            color: 'white',
            textAlign: 'left',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🟦 Farcaster/Base alpha
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>What's hot on Base 24h</p>
        </button>

        <button
          onClick={() => fetchTrend('token-solana')}
          disabled={loading}
          style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '2px solid #10b981',
            backgroundColor: loading ? '#4b5563' : '#047857',
            color: 'white',
            textAlign: 'left',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🟩 Solana degen play
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>2h mentions leader</p>
        </button>

        <button
          onClick={() => fetchTrend('token-base')}
          disabled={loading}
          style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '2px solid #6366f1',
            backgroundColor: loading ? '#4b5563' : '#4338ca',
            color: 'white',
            textAlign: 'left',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🟣 Base/ETH moonshot
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Fresh 2h pump</p>
        </button>
      </div>

      {loading && (
        <p style={{ marginTop: '2rem', fontSize: '1.25rem', color: '#a855f7' }}>
          Loading trend data...
        </p>
      )}

      {error && (
        <p style={{ marginTop: '2rem', fontSize: '1.25rem', color: '#f87171' }}>{error}</p>
      )}

      {data && (
        <div
          style={{
            marginTop: '2rem',
            width: '100%',
            maxWidth: '640px',
            backgroundColor: '#111827',
            padding: '1.75rem',
            borderRadius: '1.25rem',
            border: '1px solid rgba(168, 85, 247, 0.4)',
          }}
        >
          <h3
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '1rem',
              textAlign: 'center',
              color: '#e9d5ff',
            }}
          >
            Today's Trend
          </h3>
          <p
            style={{
              fontSize: '1.25rem',
              textAlign: 'center',
              wordBreak: 'break-word',
            }}
          >
            {data.text}
          </p>
        </div>
      )}
    </main>
  );
}
