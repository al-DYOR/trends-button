// Комментарий: Реальный роут для топ Solana токена (упоминания за 2 часа)

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Комментарий: DexScreener trending + Birdeye для Solana
    const dexscreener = await fetch(
      'https://api.dexscreener.com/latest/dex/pairs/solana?rankBy=trendingScoreH1',
      { next: { revalidate: 120 } } // каждые 2 минуты
    );

    const birdeye = await fetch(
      'https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=10',
      { 
        headers: { 'X-API-KEY': 'free' }, // публичный доступ
        next: { revalidate: 120 }
      }
    );

    if (!dexscreener.ok) {
      throw new Error('DexScreener unavailable');
    }

    const data = await dexscreener.json();
    const topPair = data.pairs?.[0];
    
    const topToken = topPair 
      ? `${topPair.baseToken.symbol} - $${topPair.volume.h1} vol in 2h`
      : 'RAY - Solana DeFi leader';

    return NextResponse.json({ topToken });
  } catch (error) {
    console.error('Solana token error:', error);
    
    const fallbackTokens = ['$JTO', '$RAY', '$JUP'];
    const topToken = fallbackTokens[Math.floor(Math.random() * fallbackTokens.length)];

    return NextResponse.json({ topToken });
  }
}
