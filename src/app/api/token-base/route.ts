import { NextResponse } from 'next/server';

// Тип для DexScreener пары
interface DexPair {
  baseToken: {
    symbol: string;
    address: string;
  };
  volume?: {
    h1?: number;  // ← h1 тоже optional!
  };
  priceUSD?: number;
  priceChange?: {
    h1?: number;
  };
  pairAddress?: string;
}

export async function GET() {
  try {
    // 1. Dune Query 6596636
    const duneResponse = await fetch(
      `https://api.dune.com/api/v1/query/6596636/results?limit=1`,
      { next: { revalidate: 300 } }
    );

    if (duneResponse.ok) {
      const data = await duneResponse.json();
      const result = data.result?.rows?.[0];
      
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

  // 2. DexScreener Base (✅ 100% типобезопасно!)
  try {
    const dexscreener = await fetch('https://api.dexscreener.com/latest/dex/pairs/base');
    const data = await dexscreener.json();
    
    const topPair = data.pairs
      ?.filter((p: DexPair) => {
        const volumeH1 = p.volume?.h1;
        return volumeH1 !== undefined && volumeH1 > 50000; // ✅ Безопасно!
      })
      .sort((a: DexPair, b: DexPair) => {
        const aVol = a.volume?.h1 || 0;
        const bVol = b.volume?.h1 || 0;
        return bVol - aVol;
      })[0];

    if (topPair?.baseToken?.symbol) {
      return NextResponse.json({
        topToken: `${topPair.baseToken.symbol} - Volume $${((topPair.volume?.h1 || 0) / 1000000).toFixed(1)}M 🚀`,
        tokenAddress: topPair.baseToken.address,
        link: 'https://trends-button.vercel.app'
      });
    }
  } catch {
    console.log('DexScreener → твои токены');
  }

  // 3. Твои токены (гарантия)
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
