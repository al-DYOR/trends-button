import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=volume_desc&per_page=20&page=1'
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      // СТРОГИЙ ФИЛЬТР: НЕ стейблы + НЕ wrapped + НЕ exchange + ЦЕНА < $100
      const topMeme = data.find((coin: any) => 
        coin.platforms?.solana && 
        coin.current_price > 0.00001 && 
        coin.current_price < 100 &&
        !['usd-coin', 'tether', 'dai', 'wrapped-sol', 'solana', 'raydium'].includes(coin.id) &&
        coin.symbol.length < 5  // Короткие тикеры = мемкоины
      );
      
      if (topMeme) {
        return NextResponse.json({
          topToken: `${topMeme.symbol.toUpperCase()} - $${topMeme.current_price.toFixed(6)} (+${Math.round(topMeme.price_change_percentage_24h || 0)}%) 🚀`,
          tokenAddress: topMeme.platforms.solana,
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
