'use client';

import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTrend = async (endpoint) => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch(`/api/${endpoint}`);
      const data = await response.json();
      setResult(data.topTrend || data.topToken || 'Data loaded!');
    } catch (err) {
      setResult('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #1e1b4b 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem',
        background: 'linear-gradient(45deg, #9333ea, #ec4899, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}>
        Crypto Trends Today
      </h1>
      
      <p style={{ 
        fontSize: '1.5rem', 
        marginBottom: '3rem', 
        textAlign: 'center',
        maxWidth: '600px',
        opacity: 0.9
      }}>
        Discover daily crypto trends from Twitter and Farcaster
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem', 
        maxWidth: '900px',
        width: '100%'
      }}>
        <button 
          onClick={() => fetchTrend('trend-crypto')}
          disabled={loading}
          style={{
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #9333ea',
            background: loading ? '#4b5563' : '#9333ea',
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)',
            transition: 'all 0.3s ease',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-4px)')}
          onMouseLeave={(e) => !loading && (e.target.style.transform = '')}
        >
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>
            🟠 What's popping on CT?
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Top narrative 24h</p>
        </button>

        <button 
          onClick={() => fetchTrend('trend-farcaster')}
          disabled={loading}
          style={{
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #3b82f6',
            background: loading ? '#4b5563' : '#3b82f6',
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-4px)')}
          onMouseLeave={(e) => !loading && (e.target.style.transform = '')}
        >
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>
            🟦 Farcaster/Base alpha
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>What's hot on Base 24h</p>
        </button>

        <button 
          onClick={() => fetchTrend('token-solana')}
          disabled={loading}
          style={{
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #10b981',
            background: loading ? '#4b5563' : '#10b981',
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s ease',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-4px)')}
          onMouseLeave={(e) => !loading && (e.target.style.transform = '')}
        >
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>
            🟩 Solana degen play
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>2h mentions leader</p>
        </button>

        <button 
          onClick={() => fetchTrend('token-base')}
          disabled={loading}
          style={{
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #6366f1',
            background: loading ? '#4b5563' : '#6366f1',
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s ease',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-4px)')}
          onMouseLeave={(e) => !loading && (e.target.style.transform = '')}
        >
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>
            🟣 Base/ETH moonshot
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Fresh 2h pump</p>
        </button>
      </div>

      {loading && (
        <div style={{
          marginTop: '3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(147, 51, 234, 0.3)',
            borderTop: '3px solid #9333ea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ fontSize: '1.5rem', color: '#9333ea' }}>Loading alpha...</p>
        </div>
      )}

      {result && (
        <div style={{
          marginTop: '3rem',
          padding: '2.5rem',
          background: 'rgba(31, 41, 55, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          maxWidth: '600px',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1.5rem', 
            background: 'linear-gradient(45deg, #9333ea, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔥 Hottest Right Now
          </h3>
          <p style={{ 
            fontSize: '1.8rem', 
            lineHeight: 1.5,
            color: 'white'
          }}>
            {result}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
