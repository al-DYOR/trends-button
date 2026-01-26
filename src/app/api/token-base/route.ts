import { NextResponse } from 'next/server';

export async function GET() {
  // DexScreener Base — БЕЗ ФИЛЬТРОВ (всегда данные!)
  try {
    const dexscreener = await fetch('https://api.dexscreener.com/latest/dex/pairs/base');
    const data = await dexscreener.json();
    
    if (data.pairs && data.pairs.length > 0) {
      // ТОП-1 по объему h24 (надежнее h1)
      const topPair = data.pairs
        .filter(p => p.baseToken && p.baseToken.symbol)
        .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];

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

  const token = tokens[Math.floor(Date.now() / 1800000) % 3]; // 30 мин

  return NextResponse.json({
    topToken: `${token.name} - Base trending live 🚀`,
    tokenAddress: token.addr,
    link: 'https://trends-button.vercel.app'
  });
}
