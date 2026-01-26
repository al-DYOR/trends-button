import { NextResponse } from 'next/server';

export async function GET() {
  // Fallback на CoinGecko (Farcaster category нестабилен)
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=1&page=1'
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const topTrend = data[0];
      return NextResponse.json({
        topTrend: `${topTrend.symbol.toUpperCase()} - Farcaster alpha 🚀`,
        link: 'https://trends-button.vercel.app',
        postUrl: 'https://trends-button.vercel.app'
      });
    }
  } catch {}

  return NextResponse.json({
    topTrend: 'Base x Farcaster meta 🚀',
    link: 'https://trends-button.vercel.app',
    postUrl: 'https://trends-button.vercel.app'
  });
}
