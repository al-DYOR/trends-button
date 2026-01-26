import { NextResponse } from 'next/server';

interface DexPair {
  baseToken: {
    symbol: string;
    address: string;
  };
  volume?: {
    h24?: number;
    h1?: number;
  };
  priceUSD?: number;
  priceChange?: {
    h24?: number;
  };
  pairAddress?: string;
}

export async function GET() {
  // DexScreener Base — БЕЗ ФИЛЬТРОВ (всегда данные!)
  try {
    const dexscreener = await fetch('https://api.dexscreener.com/latest/dex/pairs/base');
    const data = await dexscreener.json();
    
    if (data.pairs && data.pairs.length > 0) {
      // ✅ ТИПЫ ВЕЗДЕ!
      const topPair = data.pairs
        .filter((p: DexPair) => p.baseToken && p.baseToken.symbol)  // ← тип p
        .sort((a: DexPair, b: DexPair) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];  // ← типы a, b

      if (topPair) {
        return NextResponse.json({
          topToken: `${topPair.baseToken.symbol} - $${topPair.priceUSD?.toFixed(6) || 'live'} (+${Math.round(topPair.priceChange?.h24 || 0)}%) 🚀`,
          tokenAddress: topPair.baseToken.address,
          link: 'https://trends-button.vercel.app'
        });
      }
    }
  } catch (e) {
    console.log('DexScreener error:', e);
  }

  // Твои токены (меняется каждые 30 минут)
  const tokens = [
    { name: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
    { name: 'BRETT', addr: '0x532f27101965dd16442E59d40670FaF5eBB142E4' },
    { name: 'TOSHI', addr: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4' }
  ];

  const token = tokens[Math.floor(Date.now() / 1800000) % 3];

  return NextResponse.json({
    topToken: `${token.name} - Base trending live 🚀`,
    tokenAddress: token.addr,
    link: 'https://trends-button.vercel.app'
  });
}
