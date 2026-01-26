import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=volume_desc&per_page=1&page=1&sparkline=false'
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const topTokenData = data[0]; // ✅ Правильное имя переменной
      return NextResponse.json({
        topToken: `${topTokenData.symbol.toUpperCase()} - $${topTokenData.current_price.toFixed(6)} (+${Math.round(topTokenData.price_change_percentage_24h || 0)}%) 🚀`,
        tokenAddress: topTokenData.platforms?.base || topTokenData.id,
        link: 'https://trends-button.vercel.app'
      });
    }
  } catch (error) {
    console.log('CoinGecko error');
  }

  const tokens = [
    { name: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
    { name: 'BRETT', addr: '0x532f27101965dd16442E59d40670FaF5eBB142E4' },
    { name: 'TOSHI', addr: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4' }
  ];

  const token = tokens[Math.floor(Date.now() / 1200000) % 3];
  
  return NextResponse.json({
    topToken: `${token.name} - Base trending live 🚀`,
    tokenAddress: token.addr,
    link: 'https://trends-button.vercel.app'
  });
}
