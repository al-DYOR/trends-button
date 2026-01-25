// Реальный роут для Base/ETH токенов (DexScreener + Basescan)
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
    
    if (topPair) {
      const tokenAddress = topPair.baseToken.address;
      const explorerLink = `https://basescan.org/token/${tokenAddress}`;
      
      return NextResponse.json({
        topToken: `${topPair.baseToken.symbol} - Base trending ${Math.round(topPair.priceChange.h1)}% 🚀`,
        tokenAddress,
        link: explorerLink
      });
    }
    
    // Fallback
    throw new Error('No trending pairs');
    
  } catch (error) {
    console.error('Base token error:', error);
    
    const fallback = {
      topToken: 'BRETT - Base meme leader',
      tokenAddress: '0x532f27101965dd16442E59d40670f757C0352c58', // BRETT
      link: 'https://basescan.org/token/0x532f27101965dd16442E59d40670f757C0352c58'
    };

    return NextResponse.json(fallback);
  }
}
