import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=farcaster&order=volume_desc&per_page=1&page=1'
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const topTrend = data[0];
      return NextResponse.json({
        topTrend: `${topTrend.symbol.toUpperCase()} - Farcaster trending 🚀`,
        link: 'https://trends-button.vercel.app',
        postUrl: 'https://trends-button.vercel.app'
      });
    }
  } catch {}

  return NextResponse.json({
    topTrend: 'Farcaster Frames meta 🚀',
    link: 'https://trends-button.vercel.app',
    postUrl: 'https://trends-button.vercel.app'
  });
}
