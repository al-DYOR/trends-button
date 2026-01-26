import { NextResponse } from 'next/server';

// Тип для DexScreener пары
interface DexPair {
  baseToken: {
    symbol: string;
    address: string;
  };
  volume?: {
    h1: number;
  };
  priceUSD?: number;
  priceChange?: {
    h1: number;
  };
  pairAddress: string;
}

export async function GET() {
  try {
    // 1. Dune Query 6596636 (ТОП ПРИОРИТЕТ)
    const duneResponse = await fetch(
      `https://api.dune.com/api/v1/query/6596636/results?limit=1`,
      { next: { revalidate: 300 } }
    );

    if (duneResponse.ok) {
      const data = await duneResponse.json();
      const result = data.result.rows[0];
      
      if (result?.topic) {
        return NextResponse.json({
          topToken: `${result.topic} - ${result.mentions || 'live'} Farcaster mentions 🚀`,
          tokenAddress: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
          link: 'https://trends-button.vercel.app'
        });
      }
    }
  } catch {
    console.log('Dune → DexScreener');
  }

  // 2. DexScreener Base (✅ типизировано!)
  try {
    const dexscreener = await fetch('https://api.dexscreener.com/latest/dex/pairs/base');
    const data = await dexscreener.json();
    
    const topPair = data.pairs
      ?.filter((p: DexPair) => p.volume?.h1 > 50000) // ✅ тип p: DexPair
      .sort((a: DexPair, b: DexPair) => (b.volume?.h1 || 0) - (a.volume?.h1 || 0))[0];

    if (topPair) {
      return NextResponse.json({
        topToken: `${topPair.baseToken.symbol} - Volume $${(topPair.volume?.h1 / 1000000).toFixed(1)}M 🚀`,
        tokenAddress: topPair.baseToken.address,
        link: 'https://trends-button.vercel.app'
      });
    }
  } catch {
    console.log('DexScreener → твои токены');
  }

  // 3. ТВОИ токены (гарантия)
  const tokens = [
    { name: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
    { name: 'BRETT', addr: '0x532f27101965dd16442E59d40670FaF5eBB142E4' },
    { name: 'TOSHI', addr: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4' }
  ];

  const token = tokens[Math.floor(Date.now() / 3600000) % 3];

  return NextResponse.json({
    topToken: `${token.name} - Base trending 🚀`,
    tokenAddress: token.addr,
    link: 'https://trends-button.vercel.app'
  });
}
