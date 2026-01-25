'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// 🔥 TypeScript фикс window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

type TrendSource = 'x' | 'farcaster' | 'token';
type Chain = 'solana' | 'base' | 'arbitrum' | 'ethereum' | 'unknown';

type TrendData = {
  text: string;
  link?: string;
  tokenAddress?: string;
  source: TrendSource;
  chain?: Chain;
};

type UserStats = {
  total: number;
  daily: number;
  remaining: number;
  canCheckIn: boolean;
};

// 🔥 ВСТАВЬ СВОЙ АДРЕС КОНТРАКТА СЮДА!
const CONTRACT_ADDRESS = "0x49B0dC204158E75eDf68E9839b95BC32cAbE3cf6"; 

const CHECKIN_ABI = [
  "function checkIn()",
  "function getUserStats(address) view returns (uint256 total, uint256 daily, uint256 remainingToday, bool canCheckIn)",
  "event CheckIn(address indexed user, uint256 total, uint256 daily)"
] as const;

export default function Home() {
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Check-in states (number вместо BigInt)
  const [userStats, setUserStats] = useState<UserStats>({ total: 0, daily: 0, remaining: 50, canCheckIn: true });
  const [checkInLoading, setCheckInLoading] = useState(false);

  // Trend loader
  const fetchTrend = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setCopied(false);

    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      const baseData: TrendData = {
        text: result.topTrend || result.topToken || result.message || 'No data received',
        link: result.link || result.postUrl || undefined,
        tokenAddress: result.tokenAddress || result.address || undefined,
        source: 'x' as TrendSource,
        chain: 'unknown' as Chain,
      };

      if (endpoint === 'trend-crypto') {
        baseData.source = 'x';
      } else if (endpoint === 'trend-farcaster') {
        baseData.source = 'farcaster';
      } else if (endpoint === 'token-solana') {
        baseData.source = 'token';
        baseData.chain = 'solana';
      } else if (endpoint === 'token-base') {
        baseData.source = 'token';
        baseData.chain = 'base';
      }

      setData(baseData);
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

  const getExplorerUrl = (chain: Chain | undefined, address: string) => {
    if (chain === 'solana') return `https://solscan.io/token/${address}`;
    if (chain === 'base') return `https://basescan.org/token/${address}`;
    if (chain === 'arbitrum') return `https://arbiscan.io/token/${address}`;
    if (chain === 'ethereum') return `https://etherscan.io/token/${address}`;
    return '';
  };

  // Check-in stats reader
  const updateUserStats = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CHECKIN_ABI, provider);
      const stats = await contract.getUserStats(address);
      
      setUserStats({
        total: Number(stats[0]),
        daily: Number(stats[1]),
        remaining: Number(stats[2]),
        canCheckIn: stats[3]
      });
    } catch (error) {
      console.log('Stats read error:', error);
    }
  }, []);

  // Degen share texts v2 - FIXED для Turbopack
  const buildShareText = (data: TrendData) => {
    let prefix = '';
    
    if (data.source === 'x') {
      prefix = '🔥 SPOTTED on X: ';
    } else if (data.source === 'farcaster') {
      prefix = '🐱‍💻 FC alpha: ';
    } else if (data.source === 'token') {
      if (data.chain === 'solana') {
        prefix = '⚡ Solana degens pumping: ';
      } else if (data.chain === 'base') {
        prefix = '🟣 Base moonshot alert: ';
      } else if (data.chain === 'arbitrum') {
        prefix = '🔶 Arbitrum alpha: ';
      } else if (data.chain === 'ethereum') {
        prefix = '🐋 ETH whales buzzing: ';
      } else {
        prefix = '🚀 Onchain alpha: ';
      }
    }

    let body = data.text.length > 140 ? data.text.slice(0, 137) + '...' : data.text;
    body = prefix + body;

    if (data.tokenAddress) {
      const short = data.tokenAddress.slice(0, 6) + '...' + data.tokenAddress.slice(-4);
      body += `\n\nToken: ${short}`;
    }

    const appUrl = 'https://trends-button.vercel.app/';
    body += `\n\nFound this alpha via Trends Button → one-click degen trends on Base\n${appUrl}\n\nLFG 🚀`;

    return body;
  };

  const handleShareOnX = () => {
    if (!data) return;
    const text = encodeURIComponent(buildShareText(data));
    const urlParam = data.link ? `&url=${encodeURIComponent(data.link)}` : '';
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}${urlParam}`;
    window.open(shareUrl, '_blank');
  };

  const handleShareOnFarcaster = () => {
    if (!data) return;
    const text = encodeURIComponent(buildShareText(data));
    const url = `https://warpcast.com/~/compose?text=${text}`;
    window.open(url, '_blank');
  };

  // Real check-in with contract (ethers v6)
  const handleCheckIn = async () => {
    if (typeof window === 'undefined' || !window.ethereum || !userStats.canCheckIn) return;
    
    setCheckInLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CHECKIN_ABI, signer);
      
      const tx = await contract.checkIn();
      await tx.wait();
      
      await updateUserStats();
      alert(`✅ Check-in #${userStats.total + 1} complete!`);
    } catch (error: any) {
      alert('Check-in failed: ' + (error.message || error.data?.message || 'Unknown error'));
    } finally {
      setCheckInLoading(false);
    }
  };

  // Init stats on load
  useEffect(() => {
    updateUserStats();
    const interval = setInterval(updateUserStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [updateUserStats]);

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
        Find what crypto degens are talking about right now.
      </p>

      {/* 2×2 button grid */}
      <div className="trends-grid">
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
        <p style={{ marginTop: '2rem', fontSize: '1.25rem', color: '#f87171' }}>
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
            border: '1px solid rgba(168,85,247,0.4)',
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

          {/* Action Buttons */}
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
                onClick={() => window.open(data.link!, '_blank')}
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

            {data.tokenAddress && (
              <button
                onClick={() => {
                  const url = getExplorerUrl(data.chain, data.tokenAddress!);
                  if (url) window.open(url, '_blank');
                }}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '999px',
                  border: '1px solid #fbbf24',
                  backgroundColor: '#92400e',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                View on Explorer
              </button>
            )}

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

            <button
              onClick={handleShareOnFarcaster}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '999px',
                border: '1px solid #a855f7',
                backgroundColor: '#6d28d9',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Share on Base / FC
            </button>
          </div>
        </div>
      )}

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
