'use client';

import { useState } from 'react';

type TrendData = {
  text: string;
  link?: string;
  tokenAddress?: string;
};

export default function Home() {
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchTrend = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setCopied(false);

    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Поддерживаем разные поля из API
      const text =
        result.topTrend ||
        result.topToken ||
        result.message ||
        'No data received';

      const link: string | undefined = result.link || result.postUrl || '';
      const tokenAddress: string | undefined =
        result.tokenAddress || result.address || '';

      setData({
        text,
        link: link || undefined,
        tokenAddress: tokenAddress || undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load trend. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy');
    }
  };

  const handleShareOnX = () => {
    if (!data) return;
    const text = encodeURIComponent(data.text);
    const urlParam = data.link ? `&url=${encodeURIComponent(data.link)}` : '';
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}${urlParam}`;
    window.open(shareUrl, '_blank');
  };

  const handleCheckIn = async () => {
    // Заглушка: здесь будет вызов контракта чек-ина
    alert('Daily check-in: here we will call the smart contract.');
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
        background:
          'linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%)',
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

      {/* Сетка 2×2 на вебе, 1×4 на мобиле */}
      <div className="trends-grid">
        {/* КНОПКА 1 */}
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
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            🟠 What's popping on CT?
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Top narrative 24h</p>
        </button>

        {/* КНОПКА 2 */}
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
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            🟦 Farcaster/Base alpha
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>What's hot on Base 24h</p>
        </button>

        {/* КНОПКА 3 */}
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
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            🟩 Solana degen play
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>2h mentions leader</p>
        </button>

        {/* КНОПКА 4 */}
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
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            🟣 Base/ETH moonshot
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Fresh 2h pump</p>
        </button>
      </div>

      {loading && (
        <p
          style={{
            marginTop: '2rem',
            fontSize: '1.25rem',
            color: '#a855f7',
          }}
        >
          Loading trend data...
        </p>
      )}

      {error && (
        <p
          style={{
            marginTop: '2rem',
            fontSize: '1.25rem',
            color: '#f87171',
          }}
        >
          {error}
        </p>
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

          {/* Кнопки действий */}
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.75rem',
            }}
          >
            {data.link && (
              <button
                onClick={() => window.open(data.link, '_blank')}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '999px',
                  border: '1px solid #3b82f6',
                  backgroundColor: '#1d4ed8',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Open post
              </button>
            )}

            {data.tokenAddress && (
              <button
                onClick={() => copyToClipboard(data.tokenAddress!)}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '999px',
                  border: '1px solid #10b981',
                  backgroundColor: '#047857',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                {copied ? 'Copied!' : 'Copy token address'}
              </button>
            )}

            {/* Share on X */}
            <button
              onClick={handleShareOnX}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '999px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#111827',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Share on X
            </button>
          </div>
        </div>
      )}

      {/* Daily check-in кнопка */}
      <button
        onClick={handleCheckIn}
        style={{
          marginTop: '2.5rem',
          padding: '0.75rem 1.75rem',
          borderRadius: '999px',
          border: '1px solid #f59e0b',
          backgroundColor: '#d97706',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
        }}
      >
        Daily check-in
      </button>
    </main>
  );
}
