import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=volume_desc&per_page=1&page=1'
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const topToken = data[0];
      return NextResponse.json({
        topToken: `${topToken.symbol.toUpperCase()} - $${topToken.current_price.toFixed(6)} (+${Math.round(topToken.price_change_percentage_24h || 0)}%) 🚀`,
        tokenAddress: topToken.platforms?.solana || 'So11111111111111111111111111111111111111112',
        link: 'https://trends-button.vercel.app'
      });
    }
  } catch {}

  return NextResponse.json({
    topToken: 'PUMP - Solana trending live 🚀',
    tokenAddress: '6p6X7wG6qmg8kAGkRC5Xb9T5pJ4kQ4kX5b9T5pJ4kQ4kX5b9T',
    link: 'https://trends-button.vercel.app'
  });
}
