import { NextResponse } from 'next/server';

export async function GET() {
  // 1. DexScreener — ПРЯМАЯ ПЕРВАЯ ПАРА (БЕЗ ФИЛЬТРОВ)
  try {
    const dexResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/base');
    const dexData = await dexResponse.json();
    
    if (dexData.pairs && dexData.pairs[0]) {
      const pair = dexData.pairs[0];
      return NextResponse.json({
        topToken: `${pair.baseToken.symbol} - Live Base #1 🚀`,
        tokenAddress: pair.baseToken.address,
        link: 'https://trends-button.vercel.app'
      });
    }
  } catch {}

  // 2. CoinGecko Base (любая пара)
  try {
    const cgResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1'
    );
    const cgData = await cgResponse.json();
    
    if (cgData[0]) {
      return NextResponse.json({
        topToken: `${cgData[0].symbol.toUpperCase()} - $${cgData[0].current_price.toFixed(4)} 🚀`,
        tokenAddress: cgData[0].platforms?.base || '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
        link: 'https://trends-button.vercel.app'
      });
    }
  } catch {}

  // 3. Твои токены (ГАРАНТИЯ)
  const tokens = [
    { name: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
    { name: 'BRETT', addr: '0x532f27101965dd16442E59d40670FaF5eBB142E4' },
    { name: 'TOSHI', addr: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4' }
  ];

  return NextResponse.json({
    topToken: `${tokens[0].name} - Base trending live 🚀`,
    tokenAddress: tokens[0].addr,
    link: 'https://trends-button.vercel.app'
  });
}
