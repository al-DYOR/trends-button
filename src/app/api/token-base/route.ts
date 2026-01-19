// Комментарий: Реальный роут для Base/ETH токенов (DexScreener + Basescan)

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dexscreenerBase = await fetch(
      'https://api.dexscreener.com/latest/dex/pairs/base?rankBy=trendingScoreH1',
      { next: { revalidate: 120 } }
    );

    if (!dexscreenerBase.ok) {
      throw new Error('Base API unavailable');
    }

    const data = await dexscreenerBase.json();
    const topPair = data.pairs?.[0];
    
    const topToken = topPair 
      ? `${topPair.baseToken.symbol} - Base trending ${topPair.priceChange.h1}%`
      : 'BRETT - Base meme leader';

    return NextResponse.json({ topToken });
  } catch (error) {
    console.error('Base token error:', error);
    
    const fallbackTokens = ['$BRETT', '$DEGEN', '$TOSHI'];
    const topToken = fallbackTokens[Math.floor(Math.random() * fallbackTokens.length)];

    return NextResponse.json({ topToken });
  }
}
