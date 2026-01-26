import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=volume_desc&per_page=10&page=1'
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      // ФИЛЬТР: НЕ стейблы + НЕ wrapped SOL
      const topSolana = data.find((coin: any) => 
        coin.platforms?.solana && 
        !['usd-coin', 'tether', 'dai', 'wrapped-sol'].includes(coin.id) &&
        coin.current_price > 0.0001  // Только мемкоины
      );
      
      if (topSolana) {
        return NextResponse.json({
          topToken: `${topSolana.symbol.toUpperCase()} - $${topSolana.current_price.toFixed(6)} (+${Math.round(topSolana.price_change_percentage_24h || 0)}%) 🚀`,
          tokenAddress: topSolana.platforms.solana,
          link: 'https://trends-button.vercel.app'
        });
      }
    }
  } catch {}

  return NextResponse.json({
    topToken: 'WIF - Solana meme king 🚀',
    tokenAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    link: 'https://trends-button.vercel.app'
  });
}
